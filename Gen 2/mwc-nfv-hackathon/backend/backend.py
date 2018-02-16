##########################################################################
##
# Copyright 2017-2018 VMware Inc.
# This file is part of VNF-ONboarding
# All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.
#
# For those usages not covered by the Apache License, Version 2.0 please
# contact:  osslegalrouting@vmware.com
 
##
 
############################################################################

from flask import Flask, render_template, send_from_directory
from flask import request
#from flask.ext.cors import CORS, cross_origin
from flask_cors import CORS, cross_origin
from werkzeug.datastructures import ImmutableMultiDict

from generate_blueprint import create_blueprint_package, cleanup
from database import db_check_credentials,db_user_signup
import logging
from logging.handlers import RotatingFileHandler
#from froala_editor import File
#import froala_editor
#from froala_editor import FlaskAdapter
from werkzeug import secure_filename

import os
import json
import database
import pprint

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '/tmp/uploads/'
CORS(app, supports_credentials=True)

#@app.route('/', methods=['GET', 'POST'])
#@app.route('/login',methods=['GET','POST'])
@app.route('/login',methods=['GET','POST'])

@cross_origin(origin='*')

def login_page():
  if request.data == "":
     return "false"
  credentials = json.loads(request.data)
  #if credentials['username'] == "admin" and credentials['password'] == "admin" :
  print(credentials['username'] ,credentials['password'],credentials['session_key']) 
  if db_check_credentials(credentials['username'] ,credentials['password']):
        print ("Found UP")
        return "true" 
  return "false"

@app.route('/signup', methods=['GET', 'POST'])

def signup():
  pprint.pprint("received signup request")
  print("Request Data:%s",request.data)
  credentials = json.loads(request.data)
  pprint.pprint(credentials)
  status = db_user_signup(credentials['username'],credentials['password'],credentials['emailaddress'])
  print(status)
  return status

@app.route('/generate', methods=['GET', 'POST'])


def generate():
    inputs = request.get_json()
    app.logger.warning("Input Received: %s\n",inputs)
    #app.logger.warning("username is : %s\n",inputs['params']['username'])
    #print(inputs['params']['session_key'])
    pprint.pprint(request.headers)
    pprint.pprint(request.headers['Authorization'])
    pprint.pprint(request.headers['Username'])
    inputs['params']['username'] = request.headers['Username']
    inputs['params']['session_key'] = request.headers['Authorization'] 
    output_file, workdir = create_blueprint_package(inputs)
    print("backend:workdir=%s\n",workdir)
    resp = send_from_directory(directory=os.path.dirname(workdir),
                               filename=os.path.basename(output_file),
                               as_attachment=True,
                               attachment_filename=os.path.basename(output_file))
    cleanup(os.path.dirname(workdir))
    return resp

@app.route('/upload', methods=['GET', 'POST'])

def upload():
   print("Received upload request")
   pprint.pprint(request.headers) 
   pprint.pprint(request.headers['Authorization']) 
   pprint.pprint(request.headers['username']) 
   username = request.headers['username']
   session_key = request.headers['Authorization']
   
   pprint.pprint(request.data)
   pprint.pprint(request.files)
   # Get the name of the uploaded files
   #uploaded_files = request.files['file']
   uploaded_files = request.files.getlist("file")
   pprint.pprint(uploaded_files)
   user_dir = ''
   for file in uploaded_files:
      if file:
	 # Make the filename safe, remove unsupported chars
          filename = secure_filename(file.filename)
          if not os.path.isdir(app.config['UPLOAD_FOLDER']):
             os.mkdir(upload_dir)

          user_dir = os.path.join(app.config['UPLOAD_FOLDER'],username)
          session_dir = os.path.join(user_dir,session_key)
          print(user_dir)
          print(session_dir)
          if not os.path.isdir(user_dir):
             os.mkdir(user_dir)
	  if not os.path.isdir(session_dir):
   	     os.mkdir(session_dir)
         
	  file.save(os.path.join(session_dir, filename))
          #file.save(filename)
 
   return 'file uploaded successfully'
   

   
#   if request.method == 'POST':
#     f = request.files['file']
#     f.save(secure_filename(f.filename))
#     return 'file uploaded successfully'

if __name__ == "__main__":
    formatter = logging.Formatter(
        "[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s")
    handler = RotatingFileHandler('vnf_backend.log', maxBytes=1000000000000, backupCount=1)
    handler.setLevel(logging.INFO)
    handler.setFormatter(formatter)
    app.logger.addHandler(handler) 
    app.logger.setLevel(logging.INFO)
    app.run(host='0.0.0.0', port=5000)
