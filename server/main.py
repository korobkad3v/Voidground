from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import io
from rembg import remove
from PIL import Image
from config import CONFIG
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CONFIG["ALLOW_ORIGINS"],  
    allow_credentials=CONFIG["ALLOW_CREDENTIALS"],
    allow_methods=CONFIG["ALLOW_METHODS"],
    allow_headers=CONFIG["ALLOW_HEADERS"],
)

@app.post("/remove-background/")
async def remove_background(file: UploadFile = File(...)):
    input_bytes = await file.read()
    input_image = Image.open(io.BytesIO(input_bytes)).convert("RGBA")
    output_image = remove(input_image)

    buf = io.BytesIO()
    output_image.save(buf, format="PNG")
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/png")