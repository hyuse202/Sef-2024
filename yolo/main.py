import numpy as np, pandas as pd
from glob import glob
import shutil, os
import matplotlib.pyplot as plt
from sklearn.model_selection import GroupKFold
from tqdm.notebook import tqdm
import seaborn as sns
import torch
import cv2
# test_df = pd.read_csv(f'./test.csv')
# def yolo2voc(image_height, image_width, bboxes):
#     """
#     yolo => [xmid, ymid, w, h] (normalized)
#     voc  => [x1, y1, x2, y1]
    
#     """ 
#     bboxes = bboxes.copy().astype(float) # otherwise all value will be 0 as voc_pascal dtype is np.int
    
#     bboxes[..., [0, 2]] = bboxes[..., [0, 2]]* image_width
#     bboxes[..., [1, 3]] = bboxes[..., [1, 3]]* image_height
    
#     bboxes[..., [0, 1]] = bboxes[..., [0, 1]] - bboxes[..., [2, 3]]/2
#     bboxes[..., [2, 3]] = bboxes[..., [0, 1]] + bboxes[..., [2, 3]]
    
#     return bboxes

# image_ids = []
# PredictionStrings = []

# for file_path in tqdm(glob('./yolo/runs/detect/exp/labels/*txt')):
#     image_id = file_path.split('/')[-1].split('.')[0]
#     w, h = test_df.loc[test_df.image_id==image_id,['width', 'height']].values[0]
#     f = open(file_path, 'r')
#     data = np.array(f.read().replace('\n', ' ').strip().split(' ')).astype(np.float32).reshape(-1, 6)
#     data = data[:, [0, 5, 1, 2, 3, 4]]
# #     bboxes = list(np.round(np.concatenate((data[:, :2], np.round(yolo2voc(h, w, data[:, 2:]))), axis =1).reshape(-1), 1).astype(str))
#     bboxes = list(np.round(np.concatenate((data[:, :2], np.round(yolo2voc(h, w, data[:, 2:]))), axis =1).reshape(-1), 3).astype(str))
#     for idx in range(len(bboxes)):
#         bboxes[idx] = str(int(float(bboxes[idx]))) if idx%6!=1 else bboxes[idx]
#     image_ids.append(image_id)
#     PredictionStrings.append(' '.join(bboxes))

# print(image_ids)

# pred_df = pd.DataFrame({'image_id':image_ids,
#                         'PredictionString':PredictionStrings})
# sub_df = pd.merge(test_df, pred_df, on = 'image_id', how = 'left').fillna("14 1 0 0 1 1")
# sub_df = sub_df[['image_id', 'PredictionString']]
# sub_df.to_csv('/yolov5x_fold4_finetune768_submission.csv',index = False)
# sub_df.tail()
model = torch.hub.load('./yolov5', 'custom', path='./checkpoints/yolov5x_fold2_finetune768_best.pt', source='local')
# Image
img = './pic/019df578e38053e614d483f7fb347b26.png'

# Inference
res = model(img)
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
# os.makedirs('./tmp')
predicted_boxes = res.pandas().xyxy[0].to_json()

print(predicted_boxes)
import json
json_data = json.loads(predicted_boxes)
x = len(json_data["xmin"])
res = []
img = cv2.imread(img)
for i in range(x):
    cv2.rectangle(img, (int(json_data["xmin"][str(i)]), int(json_data["ymin"][str(i)])), (int(json_data["xmax"][str(i)]), int(json_data["ymax"][str(i)])), (0, 255, 0), 2)
    label = diagnosis_dict[json_data["class"][str(i)]] + ": " + str(json_data["confidence"][str(i)])
    res.append(label)
    cv2.putText(img, label, (int(json_data["xmin"][str(i)]), int(json_data["ymin"][str(i)]) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

# img = res.show()
cv2.imwrite('img.jpg', img)
# cv2.imread('img.jpg', 1)s
# print(res)