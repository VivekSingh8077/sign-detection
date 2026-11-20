# SignAI – Real-Time Sign Language Recognition

SignAI is a hand sign recognition and translation system designed to recognize hand gestures using computer vision and machine learning.

## Features

- Real-time hand detection using MediaPipe.
- Hand landmark extraction.
- ONNX-based sign recognition.
- Gesture classification.
- Sign-to-text translation.
- Interactive user interface.

## Tech Stack

- Python
- OpenCV
- MediaPipe
- ONNX Runtime
- Streamlit

## Project Structure

```text
signai/
├── models/
├── frontend/
├── backend/
├── hand_landmarker.task
├── sign_model.onnx
├── class_indices.json
├── requirements.txt
└── README.md
```

## Installation

Clone the repository:

```bash
git clone https://github.com/VivekSingh8077/sign-detection.git
cd sign-detection
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Running the Project

Follow the application-specific instructions in the project source files.

## Author

Vivek Singh

GitHub: https://github.com/VivekSingh8077