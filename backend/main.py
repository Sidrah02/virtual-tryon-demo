from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from PIL import Image, ImageEnhance
import io
import json
from typing import Optional
import os

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:8000",
    "https://virtual-tryon-demo.vercel.app",
    "*" # For development ease
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Virtual Try-On Backend Running"}

@app.post("/api/render")
async def render_image(
    photo: UploadFile = File(...),
    outfit: UploadFile = File(...),
    x: float = Form(...), # Center X
    y: float = Form(...), # Center Y
    container_width: float = Form(...), # Width of the container in frontend
    outfit_width: float = Form(...), # rendered width of outfit in frontend (before rotation)
    rotation: float = Form(...),
    opacity: float = Form(...),
    flip: str = Form(...) # bool or str "true"/"false" from FormData
):
    try:
        # Load user photo
        photo_bytes = await photo.read()
        base_img = Image.open(io.BytesIO(photo_bytes)).convert("RGBA")
        
        # Determine scale factor
        # If container_width is passed, we map frontend pixels to base_img pixels
        # k = real_width / container_width
        
        bw, bh = base_img.size
        # Protect against div/0
        if container_width <= 0:
            k = 1.0
        else:
            k = bw / container_width
            
        real_x = x * k
        real_y = y * k
        real_outfit_w = outfit_width * k
        
        # Load outfit image
        outfit_bytes = await outfit.read()
        outfit_img = Image.open(io.BytesIO(outfit_bytes)).convert("RGBA")
        
        # 1. Flip
        # FormData sends string "true"/"false" usually if manually appended, or handle bool conversion
        is_flip = str(flip).lower() == 'true'
        if is_flip:
            outfit_img = outfit_img.transpose(Image.FLIP_LEFT_RIGHT)
            
        # 2. Resize to target width (preserving aspect ratio)
        ow, oh = outfit_img.size
        aspect = oh / ow
        target_w = int(real_outfit_w)
        target_h = int(target_w * aspect)
        
        if target_w > 0 and target_h > 0:
            outfit_img = outfit_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # 3. Rotate
        # expand=True to calculate correct bounding box logic
        outfit_img = outfit_img.rotate(-rotation, resample=Image.BICUBIC, expand=True)
        
        # 4. Opacity
        if opacity < 1.0:
            alpha = outfit_img.split()[3]
            alpha = ImageEnhance.Brightness(alpha).enhance(opacity)
            outfit_img.putalpha(alpha)
            
        # 5. Paste
        # We have center coordinates (real_x, real_y)
        # We need top-left of the image to paste
        rw, rh = outfit_img.size
        paste_x = int(real_x - rw / 2)
        paste_y = int(real_y - rh / 2)
        
        # Composite handling transparency
        final_img = base_img.copy()
        final_img.paste(outfit_img, (paste_x, paste_y), outfit_img)
        
        # Save
        img_byte_arr = io.BytesIO()
        final_img.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        return Response(content=img_byte_arr.getvalue(), media_type="image/png")
        
    except Exception as e:
        print(f"Error: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
