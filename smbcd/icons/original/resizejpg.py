from PIL import Image
import os

def resize_all_jpgs(directory=".", width=200, height=200):
    """
    Resize all JPG images in the specified directory to the given dimensions.

    :param directory: Path to the directory containing JPG files (default is current directory).
    :param width: The target width for resizing (default is 200 pixels).
    :param height: The target height for resizing (default is 200 pixels).
    """
    # List all files in the directory
    files = os.listdir(directory)
    jpg_files = [f for f in files if f.lower().endswith('.jpg')]

    if not jpg_files:
        print("No JPG files found in the directory.")
        return

    for jpg_file in jpg_files:
        input_path = os.path.join(directory, jpg_file)
        output_path = os.path.join(directory, f"{jpg_file}")
        
        try:
            # Open, resize, and save each JPG file
            with Image.open(input_path) as img:
                # Resize the image to the specified dimensions
                img_resized = img.resize((width, height), Image.LANCZOS)
                img_resized.save(output_path, 'JPEG')
                print(f"Successfully resized {input_path} to {output_path}")
        except Exception as e:
            print(f"Error resizing {input_path}: {e}")

# Example usage: Resizes all .jpg files in the current directory to 200x200 pixels
resize_all_jpgs()
