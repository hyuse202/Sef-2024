from flask import Flask, request
import requests
import cv2
import json
import numpy as np
app = Flask(__name__)
api_key = 'public_12a1ym5A8VFUcdpbdwP2Kpj4CcEQ'
id = '12a1ym5'
diagnosis_dict = {
    0: "Phi dong mach chu",
    1: "Xep phoi",
    2: "Voi hoa",
    3: "Tim to",
    4: "Khoi đac o phe nang",
    5: "Benh phoi ke",
    6: "Tham nhiem phoi",
    7: "Vung mo/toi o phoi",
    8: "Not/Khoi phoi",
    9: "Thuong ton khac",
    10: "Tran dich mang phoi",
    11: "Day mang phoi",
    12: "Tran khi mang phoi",
    13: "Xo phoi",
}
@app.route('/rect', methods=['POST'])
def rect():
    json_data = request.get_json()

    x = len(json_data["input"]["name"])
    # url = 'https://upcdn.io/12a1ym5/raw/uploads/2024/01/07/4kuX7RMDDo-1.png'
    image = requests.get(json_data["url"])
    img = image.content
    image = cv2.imdecode(np.asarray(bytearray(img)), -1)
    for i in range(x):
        cv2.rectangle(image, (int(json_data["input"]["xmin"][str(i)]), int(json_data["input"]["ymin"][str(i)])), (int(json_data["input"]["xmax"][str(i)]), int(json_data["input"]["ymax"][str(i)])), (0, 255, 255), 1)
        label = "(" + str(i) + ") " + diagnosis_dict[json_data["input"]["class"][str(i)]] 
        cv2.putText(image,  label, (int(json_data["input"]["xmin"][str(i)]), int(json_data["input"]["ymin"][str(i)]) - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 255, 255), 1)
    output_path = f"outputs.png"
    cv2.imwrite(output_path, image)
    # For example, display the image
    

    url = "https://api.bytescale.com/v2/accounts/12a1ym5/uploads/form_data"
    headers = {
        "Authorization": "Bearer public_12a1ym5A8VFUcdpbdwP2Kpj4CcEQ"
    }
    files = {"file": open("outputs.png", "rb")}  # Open the file in binary mode

    response = requests.post(url, headers=headers, files=files)

    response.raise_for_status()  # Raise an exception for non-2xx status codes
    # print(type(response.text))
    print("Success:", response.text)  # Print the response text
    # res = json.load(str(response.text))
    # print(x)
    return response.text

@app.route('/')
def index():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)