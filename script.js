const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const transformOption = document.getElementById("transformOption");

if(uploadForm){
    uploadForm.addEventListener("submit", (e) =>{
        e.preventDefault();

        const file = fileInput.files[0];
        const selectedOption = transformOption.value;

        if(file){
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;

                localStorage.setItem("uploadedImage", imageData);

                if (selectedOption === "grayscale") {
                    window.location.href = "gray.html";
                } else if (selectedOption === "blur") {
                    window.location.href = "blur.html";
                }
            };

            reader.readAsDataURL(file);
        }else{
            alert("Please upload a valid image!");
        }
    });
}

function displayImage(transformFunction){
    const imageData = localStorage.getItem("uploadedImage");
    if(imageData){
        const img = new Image();
        img.src = imageData;

        img.onload = () =>{
            const originalCanvas = document.getElementById("originalCanvas");
            const transformedCanvas = document.getElementById("transformedCanvas");
            const originalCtx = originalCanvas.getContext("2d");
            const transformedCtx = transformedCanvas.getContext("2d");

            originalCanvas.width = img.width;
            originalCanvas.height = img.height;
            transformedCanvas.width = img.width;
            transformedCanvas.height = img.height;

            originalCtx.drawImage(img, 0, 0);

            transformFunction(originalCtx, transformedCtx, img);
        };
    }else{
        alert("No image found! Please go back and upload an image.");
        window.location.href = "index.html";
    }
}

function displayImage(transformationFunction){
    const uploadedImage = localStorage.getItem("uploadedImage");
    const img = new Image();
    const originalCanvas = document.getElementById("originalCanvas");
    const transformedCanvas = document.getElementById("transformedCanvas");

    const originalCtx = originalCanvas.getContext("2d");
    const transformedCtx = transformedCanvas.getContext("2d");

    img.onload = function (){
        originalCanvas.width = img.width;
        originalCanvas.height = img.height;
        transformedCanvas.width = img.width;
        transformedCanvas.height = img.height;

        originalCtx.drawImage(img, 0, 0);

        transformationFunction(originalCtx, transformedCtx, img);
    };

    img.src = uploadedImage;
}

function applyGrayscale(originalCtx, transformedCtx, img){
    const width = img.width;
    const height = img.height;
    const imageData = originalCtx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    for(let i = 0; i < pixels.length; i += 4){
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        const gray = 0.3 * r + 0.59 * g + 0.11 * b;

        pixels[i] = gray;
        pixels[i + 1] = gray;
        pixels[i + 2] = gray;
    }

    transformedCtx.putImageData(imageData, 0, 0);
}

function applyBlur(originalCtx, transformedCtx, img){
    const width = img.width;
    const height = img.height;
    const imageData = originalCtx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    for(let y = 1; y < height - 1; y++){
        for(let x = 1; x < width - 1; x++){
            let r = 0, g = 0, b = 0, count = 0;

            for(let dy = -5; dy <= 5; dy++){
                for(let dx = -5; dx <= 5; dx++){
                    const nx = x + dx;
                    const ny = y + dy;

                    if(nx >= 0 && nx < width && ny >= 0 && ny < height){
                        const idx = (ny * width + nx) * 4;
                        r += pixels[idx];
                        g += pixels[idx + 1];
                        b += pixels[idx + 2];
                        count++;
                    }
                }
            }

            const idx = (y * width + x) * 4;
            pixels[idx] = r / count;
            pixels[idx + 1] = g / count;
            pixels[idx + 2] = b / count;
        }
    }

    transformedCtx.putImageData(imageData, 0, 0);
}