from flask import Flask, render_template
import os

app = Flask(__name__, template_folder="front/new_struct/site_body/src")

@app.route('/')
def serve_index():
    return render_template('App.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)