# Prediction interface for Cog ⚙️
# https://github.com/replicate/cog/blob/main/docs/python.md
import torch
from cog import BasePredictor, Input, Path
from typing import Any
import json
import cv2
import numpy as np
diagnosis_dict = {
    0: "Phì động mạch chủ",
    1: "Xẹp phổi",
    2: "Vôi hóa",
    3: "Tim to",
    4: "Khối đặc ở phế nang",
    5: "Bệnh phổi kẽ",
    6: "Thâm nhiễm phổi",
    7: "Vùng mờ/tối ở phổi",
    8: "Nốt/Khối phổi",
    9: "Thương tổn khác",
    10: "Tràn dịch màng phổi",
    11: "Dày màng phổi",
    12: "Tràn khí màng phổi",
    13: "Xơ phổi",
}
class Predictor(BasePredictor):
    def setup(self) -> None:
        self.model = torch.hub.load('./yolov5', 'custom', path='./checkpoints/yolov5x_fold4_finetune768_best.pt', source='local')
        # self.model = torch.load("./weights.pth")

    def predict(
        self,
        image: Path = Input(description = "gray scale")) -> Any:
        image = str(image)
        res = self.model(image)
        predicted_boxes = res.pandas().xyxy[0].to_json()
        json_data = json.loads(predicted_boxes)
        x = len(json_data["xmin"])
        res = []

        if x == 0:
            res.append("null")
            return res
        image = cv2.imread(image)
        for i in range(x):
            cv2.rectangle(image, (int(json_data["xmin"][str(i)]), int(json_data["ymin"][str(i)])), (int(json_data["xmax"][str(i)]), int(json_data["ymax"][str(i)])), (0, 255, 0), 2)
            label = diagnosis_dict[json_data["class"][str(i)]] + ": " + str(json_data["confidence"][str(i)])
            res.append(label)
            cv2.putText(image,  diagnosis_dict[json_data["class"][str(i)]], (int(json_data["xmin"][str(i)]), int(json_data["ymin"][str(i)]) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        output_path = f"outputs.png"
        cv2.imwrite(output_path, image)

        return predicted_boxes
        # res.save(f"test.json")
        # return res
        # return img_path
        """Run a single prediction on the model"""
        # processed_input = preprocess(image)
        # output = self.model(processed_image, scale)
        # return postprocess(output)
