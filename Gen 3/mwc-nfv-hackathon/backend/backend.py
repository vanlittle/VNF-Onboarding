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

from generate_blueprint import create_blueprint_package, create_multivdu_blueprint_package, convert_payload_to_json,cleanup
from database import db_check_credentials,db_user_signup,db_generate_newpassword
from prefixmiddleware import PrefixMiddleware
import logging
from logging.handlers import RotatingFileHandler
#from froala_editor import File
#import froala_editor
#from froala_editor import FlaskAdapter
from werkzeug import secure_filename
from sendemail import sendMail,draft_mail_text

import os
import json
import database
import pprint
from flask import jsonify

app = Flask(__name__)
app.wsgi_app = PrefixMiddleware(app.wsgi_app, prefix='/backend')
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
  if db_check_credentials(credentials['username'] ,credentials['password']):
        print(credentials['username'] ,credentials['password'],credentials['session_key']) 
        print ("Found UP")
        return "true" 
  return "false"

@app.route('/signup', methods=['GET', 'POST'])

def signup():
  sendMail = False
  pprint.pprint("received signup request")
  print("Request Data:%s",request.data)
  credentials = json.loads(request.data)
  pprint.pprint(credentials)
  status = db_user_signup(credentials['username'],credentials['password'],credentials['emailaddress'])
  print(status)
  if(status == "True" and sendMail == True ):
      mail_text = draft_mail_text("User Registration",credentials['username'],credentials['password'])
      print "signup:",mail_text
      sendMail([credentials['emailaddress']],"VNF Onboarding User Registration",mail_text) 
  return status

@app.route('/generate', methods=['GET', 'POST'])


def generate():
    inputs = request.get_json()
    #app.logger.warning("Input Received: %s\n",inputs)
    #app.logger.warning("username is : %s\n",inputs['params']['username'])
    print("Inputs Received: %s\n",inputs)
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


@app.route('/forgetpassword', methods=['GET', 'POST'])

def forgetpassword():
   sendMail = False
   print "Received forgetpassword request",request.data
   inputs = inputs = request.get_json()
   print "Forgetpassword",inputs
   #inputs['password'] = ""
   status = db_generate_newpassword(inputs)
   if status == 1:
      print "forgetpassword:user does not exist", status
      return "False"
   elif status == 0 and sendMail == True:
      mail_text = ""
      if inputs['username']:
         print "after updating password",inputs
         mail_text = draft_mail_text("Forget Password",inputs['username'],inputs['password'])
      print "forget password:",mail_text
      sendMail([inputs['emailaddress']],"VNF Onboarding New Password",mail_text)
   print "forgetpassword:new password set",status
   return "True"


   
@app.route('/multivdu_blueprint', methods=['POST'])

def multivdu_blueprint():
  if request.method == 'POST':
     print "Received POST request to generate Multi-VDU Blueprint with data= {}".format(request.data)
     print "We arrived correct"
     inputs = json.loads(request.data)
     print "inputs:",inputs
     inputs['username'] = request.headers['Username']
     inputs['session_key'] = request.headers['Authorization']
     print "inputs:",inputs
     #multivdu_inputs = convert_payload_to_json(inputs)
     output_file, workdir = create_multivdu_blueprint_package(inputs)
     resp = send_from_directory(directory=os.path.dirname(workdir),
                           filename=os.path.basename(output_file),
                           as_attachment=True,
                           attachment_filename=os.path.basename(output_file))
     cleanup(os.path.dirname(workdir))
     return resp
     #print "output_file = {},workdir = {}".format(output_file,workdir)
     #resp = output_file
     #cleanup(os.path.dirname(workdir))
     #return resp
  else:
     print "Invalid request. Has to be POST"
     return
   

if __name__ == "__main__":
    formatter = logging.Formatter(
        "[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s")
    handler = RotatingFileHandler('vnf_backend.log', maxBytes=1000000000000, backupCount=1)
    handler.setLevel(logging.INFO)
    handler.setFormatter(formatter)
    app.logger.addHandler(handler) 
    app.logger.setLevel(logging.INFO)
    #app.run(host='0.0.0.0', port=5000)
    app.run(host='0.0.0.0', port=5000, debug=True)
