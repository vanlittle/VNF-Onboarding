#!/usr/bin/env/python

#########################################################################
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
 
###########################################################################

import argparse
from jinja2 import Template
import os
import requests
import shutil
import validators
import tempfile
import yaml
import subprocess

TEMPLATES_DIR = '../templates'
TEMPLATES = {'OpenStack': 'OS-template.yaml',
             'TOSCA_OpenStack': 'OS-TOSCA-template.yaml',
             'CUSTOM_FLAVOR': 'CUSTOM-FLAVOR-template.yaml',
             'OSM_OpenStack': 'OS-OSM-template.yaml',
             'OSM_NSD_OpenStack': 'OS-OSM-NSD-template.yaml',
             'vCloud Director': 'VCD-template.yaml',
             'TOSCA_vCloud Director': 'VCD-TOSCA-template.yaml',
             'OSM_vCloud Director': 'VCD-OSM-template.yaml',
             'OSM_NSD_vCloud Director': 'VCD-OSM-NSD-template.yaml',
             'VIO': 'VIO-template.yaml',
             'TOSCA_VIO': 'VIO-TOSCA-template.yaml',
             'OSM_VIO': 'VIO-OSM-template.yaml'}

session_dir = ''

def parse_argv():
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--inputs', required=True, metavar='<inputs_file_path>')
    return parser.parse_args()


def gen_name_and_workdir(inputs):
    params = inputs['params']
    #name = params['vnf_type'] + '-' + params['orch_type'] + '-'+ params['env_type']
    name = params['vnf_type'] + '-' + params['env_type']
    name = name.replace(" ", "")    #Replacing Spaces in Dir names, as it causes problem parsing
    upload_dir = "/tmp/uploads"
    if not os.path.isdir(upload_dir):
       os.mkdir(upload_dir)
    user_dir =  os.path.join(upload_dir,params['username'])
    if not os.path.isdir(user_dir):
       os.mkdir(user_dir)
    session_dir = os.path.join(user_dir, params['session_key'])
    if not os.path.isdir(session_dir):
       os.mkdir(session_dir)  
    workdir = os.path.join(session_dir, name)
    workdir = workdir.replace(" ", "")  #Replacing Spaces in Dir names, as it causes problem parsing
    if not os.path.isdir(workdir):
       os.mkdir(workdir)
    return name, workdir


def get_template(template_file):
    with open(template_file) as f:
        text = f.read()
    return Template(text)


def copy_README(inputs, workdir):
    README = 'README.md'
    template_file = os.path.join(TEMPLATES_DIR, README)
    with open(template_file) as f:
        text = f.read()
    rendered = Template(text).render(inputs['params'])
    out_file = os.path.join(workdir, README)
    with open(out_file, 'w') as f:
        f.write(rendered)


def get_file_from_url(url):
    return requests.get(url).text, ('.' + url).split('.')[-1]


def write_scripts_file(working_dir, script_phase, ext, body):
    if ext:
        ext = '.' + ext
    path = os.path.join(working_dir, script_phase + ext)
    with open(path, 'w') as f:
        f.write(body)
    return path


def create_work_dir(workdir):
    if not os.path.isdir(workdir):
       os.mkdir(workdir)


def cleanup(workdir):
   print("gb:inside cleanup\n")
   if os.path.isdir(session_dir):
      print("gb:clenup:session_dir:%s\n",session_dir)
      shutil.rmtree(session_dir)
   else:
      print("gb:cleanup:workdir:%s\n",workdir)
      shutil.rmtree(workdir)

def create_package(name, workdir):
    shutil.make_archive(
        os.path.abspath(workdir),
        'zip',
        os.path.dirname(workdir),
        name)
    return workdir + '.zip'

def get_orch_types(params):
	orch = params['orch_type']
	## TODO : (this is workaround) need to will handle Cloudify 4.0 in proper way.
    
	#if params['orch_type'] == 'Cloudify 4.0':
	#   orch = 'Cloudify 3.4'
	   
	return orch 

def get_git_flag(params):
     uploadflag = params['git_upload']
     return uploadflag 

def get_env_types(params):
     env = params['env_type']
     return env 

def get_vnf_types(params):
     vnf = params['vnf_type']
     return vnf 

def get_flavor_type(params):
     flavor = params['flavor']
     return flavor 

def add_scripts(params, workdir):
    params['scripts'] = None if all(not s for p, s in params['scripts'].iteritems()) else params['scripts']
    print("add_scripts: %s\n",params)
    #scripts = params['scripts']
    print("scripts dict :%s\n",params['scripts'])
    scripts_dir = ''
    
    if params['scripts']:
        scripts_dir = os.path.join(workdir, 'scripts')
        os.mkdir(scripts_dir)
        #if os.path.isdir('/tmp/uploads/'):
        #   print("Uploading File in /tmp/uploads")
        #   shutil.copytree('/tmp/uploads',scripts_dir)
        

#        for phase, script in scripts.iteritems():
#            if script:
#                if validators.url(script):
#                    body, ext = get_file_from_url(script)
#                else:
#                    body, ext = script, ''
#                write_scripts_file(scripts_dir, phase, ext, body)
#                params['scripts'][phase] = os.path.join('scripts', phase + '.' + ext)

    if not os.path.exists((os.path.join(workdir,'scripts'))):
        scripts_dir = os.path.join(workdir,'scripts')
        print("gb:scripts_dir:",scripts_dir)
        os.mkdir(scripts_dir)
    upload_dir = os.path.join('/tmp/uploads',params['username'])
    upload_scripts_dir = os.path.join(upload_dir,params['session_key'])
    print("gb:upload_scripts_dir:",upload_scripts_dir)
    if os.path.isdir(upload_scripts_dir):
       src_files = os.listdir(upload_scripts_dir)
       print("gb:list uploaded files:",src_files)
       for file_name in src_files:
			full_file_name = os.path.join(upload_scripts_dir, file_name)
			print("Check create dict:%s",params['scripts']); 
			print("gb:full file name:",full_file_name)
			if (os.path.isfile(full_file_name)):
				print("print file name %s\n", os.path.basename(full_file_name))
				shutil.copy(full_file_name, scripts_dir)
   
def generate_cloudify_blueprint(params, workdir, name):
    template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES[params['env_type']]))
    print("Inside generate cloudify blueprint :%s\n",params)
    print("Print Template : %s\n",template)
    out = template.render(params)
    out_file = os.path.join(workdir, name + '.yaml')
    with open(out_file, 'w') as f:
        f.write(out)

def generate_standard_osm_blueprint(params, workdir, name):
    template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES['OSM_' + params['env_type']]))
    out = template.render(params)
    out_file = os.path.join(workdir, name + '-OSM.yaml')
    with open(out_file, 'w') as f:
        f.write(out)

def generate_standard_osm_nsd_blueprint(params, workdir, name):
    template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES['OSM_NSD_' + params['env_type']]))
    out = template.render(params)
    out_file = os.path.join(workdir, name + '-OSM-NSD.yaml')
    with open(out_file, 'w') as f:
        f.write(out)

def generate_riftio_package(params, workdir, name, create_nsd=True):
    vcpu = params['cpu']
    memory = params['ram']
    storage = params['disk']
    image = params['image_id']
    num_interfaces = -1 
    cinit_scripts_dir = os.path.join(workdir,'scripts')
    cinit_files = os.listdir(cinit_scripts_dir)
    if not cinit_files:
        cloud_init_file = None
    else:
        cloud_init_file = cinit_files[0]
        cloud_init = os.path.join(cinit_scripts_dir, cloud_init_file)
        print "In RIFT.io: cloud_init_file: %s" % (cloud_init)
    
    for key in params:
        if key.startswith("nic"):
            num_interfaces += 1 

    rift_cmd = "./generate_riftio_descriptor_pkg_5.3.sh -c -a {nsd} --vcpu {vcpu} --memory {memory} --storage {storage} --image {image} {cloud_init} --interfaces {interfaces} \"{out_file}\" \"{vnf_name}\"".format( vcpu=vcpu, 
                                    memory=memory, 
                                    storage= 0 if not storage else storage, 
                                    image=image, 
                                    cloud_init = "--cloud-init-file "+cloud_init if cloud_init_file is not None else "",
                                    interfaces=num_interfaces, 
                                    out_file=workdir, 
                                    vnf_name=name,
                                    nsd = "--nsd" if create_nsd else "")
    print "RIFT Generate Descriptor command: ", rift_cmd
    rc = subprocess.call(rift_cmd, shell=True)
    if rc != 0:
        print("ERROR: RIFT.ware Descriptor generation Failed!! Error: ", rc)
        raise

    ''' Remove the 'scripts' dir from the package, as RIFT.ware doesn't need it. 
        The files have already been copied to the correct folder inside the tar.gz package
    '''
    shutil.rmtree(cinit_scripts_dir)
    

def generate_standard_tosca_blueprint(params, workdir, name):
    template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES['TOSCA_' + params['env_type']]))
    out = template.render(params)
    out_file = os.path.join(workdir, name + '-TOSCA.yaml')
    with open(out_file, 'w') as f:
        f.write(out)
    shutil.copytree(os.path.join(TEMPLATES_DIR, 'types'), os.path.join(workdir, 'types'))


def generate_flavor_blueprint(params, workdir, name):
    template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES['CUSTOM_FLAVOR']))
    out = template.render(params)
    out_file = os.path.join(workdir, 'CUSTOM-FLAVOR.yaml')
    with open(out_file, 'w') as f:
        f.write(out)

def copy_inputs_template(params, workdir):
    inputs_name = params['env_type'] + '-inputs.yaml'
    shutil.copyfile(os.path.join(TEMPLATES_DIR, inputs_name), os.path.join(workdir, inputs_name))


def remove_file(filepath):
    os.remove(filepath)


def create_blueprint_package(inputs):
    name, workdir = gen_name_and_workdir(inputs)
    try:
        create_work_dir(workdir)
        add_scripts(inputs['params'], workdir)
        copy_README(inputs, workdir)
        print "The input parameter is ", get_orch_types(inputs['params']) 
        print "The git flag is ", get_git_flag(inputs['params']) 
        print "The input list parameter is ", inputs['params'] 
        commit_comment=get_env_types(inputs['params']) + '_' + get_orch_types(inputs['params']) + '_'+ get_vnf_types(inputs['params'])
        orch_name= get_orch_types(inputs['params'])
        env_name= get_env_types(inputs['params'])
        vnf_name= get_vnf_types(inputs['params'])
        if get_orch_types(inputs['params']) == 'Cloudify 3.4' or get_orch_types(inputs['params']) == 'Cloudify 4.0' : 
            generate_cloudify_blueprint(inputs['params'], workdir, name)
            if get_flavor_type(inputs['params']) == 'auto':
                 generate_flavor_blueprint(inputs['params'], workdir, name)
            copy_inputs_template(inputs['params'], workdir)
            output_file = create_package(name, workdir)
            print "The git flag outside ", get_git_flag(inputs['params']) 
            if get_git_flag(inputs['params']) == True: 
                print "The git flag inside ", get_git_flag(inputs['params']) 
                print("params for git upload : output file = %s\n, workdir = %s\n,orch_name = %s\n,commit_comment = %s\n",output_file, workdir, orch_name, commit_comment)
#                Process=subprocess.call(['./git_upload.sh', output_file, workdir, orch_name, commit_comment])
                Process=subprocess.call(['./git_upload.sh', output_file, workdir, commit_comment, orch_name, env_name, vnf_name])
#                Process=subprocess.call(['./git_upload.sh', output_file, workdir])  
#            Process=subprocess.call(['./git_upload.sh', output_file, workdir])
            return output_file, workdir
        elif get_orch_types(inputs['params']) == 'OSM 3.0':
           print("Check if we have received create_script",inputs)
           generate_standard_osm_blueprint(inputs['params'], workdir, name)
           generate_standard_osm_nsd_blueprint(inputs['params'], workdir, name)
           copy_inputs_template(inputs['params'], workdir)
           output_file = create_package(name, workdir)
           print "The git flag outside ", get_git_flag(inputs['params']) 
           if get_git_flag(inputs['params']) == True: 
               print "The git flag inside ", get_git_flag(inputs['params']) 
#               Process=subprocess.call(['./git_upload.sh', output_file, workdir])
               Process=subprocess.call(['./git_upload.sh', output_file, workdir, commit_comment, orch_name, env_name, vnf_name])
#           Process=subprocess.call(['./git_upload.sh', output_file, workdir])
           return output_file, workdir
        elif get_orch_types(inputs['params']) == 'RIFT.ware 5.3':
           print "inside RIFT.ware block, inputs: ", inputs
           generate_riftio_package(inputs['params'], workdir, name, True)
           output_file = create_package(name, workdir)
           return output_file, workdir
        elif get_orch_types(inputs['params']) == 'TOSCA 1.1':
           generate_standard_tosca_blueprint(inputs['params'], workdir, name)
           if get_env_types(inputs['params']) == 'OpenStack':
               if get_flavor_type(inputs['params']) == 'Custom Flavor':
                   generate_flavor_blueprint(inputs['params'], workdir, name)
           copy_inputs_template(inputs['params'], workdir)
           output_file = create_package(name, workdir)
           print "Got the output file", output_file
           print "Got the working directory",workdir 
#             Process=subprocess.Popen('./git_upload.sh %s' % (output_file), shell=True) 
           print "The git flag outside ", get_git_flag(inputs['params']) 
           if get_git_flag(inputs['params']) == True: 
                print "The git flag inside ", get_git_flag(inputs['params']) 
                Process=subprocess.call(['./git_upload.sh', output_file, workdir, commit_comment, orch_name, env_name])
#           Process=subprocess.call(['./git_upload.sh', output_file, workdir])
           return output_file, workdir
    finally:
        print("inside finally")
        cleanup(workdir)

if __name__ == '__main__':
    args = parse_argv()
    with open(args.inputs) as f:
        inputs = yaml.load(f.read())
        output_file, workdir = create_blueprint_package(inputs)
#        print "Got the output file", output_file
#        Process=subprocess.Popen('./git_upload.sh %s' % (str(output_file)))
       # subprocess.call(["git_upload.sh","output_file"],shell=True)
        cleanup(workdir)
