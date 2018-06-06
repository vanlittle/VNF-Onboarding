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
import tarfile
import hashlib
import time
from datetime import datetime
import stat
import re
import json
import pdb 

TEMPLATES_DIR = '../templates'
TEMPLATES = {'OpenStack': 'OS-template.yaml',
             'TOSCA_OpenStack': 'OS-TOSCA-template.yaml',
             'CUSTOM_FLAVOR': 'CUSTOM-FLAVOR-template.yaml',
             'HEAT_CUSTOM_FLAVOR': 'CUSTOM-FLAVOR-HEAT-template.yaml',
             'OSM_OpenStack': 'OS-OSM-template.yaml',
             'OSM_NSD_OpenStack': 'OS-OSM-NSD-template.yaml',
             'NONE_OpenStack': 'OS-NONE-template.yaml',
             'vCloud Director': 'VCD-template.yaml',
             'TOSCA_vCloud Director': 'VCD-TOSCA-template.yaml',
             'OSM_vCloud Director': 'VCD-OSM-template.yaml',
             'OSM_NSD_vCloud Director': 'VCD-OSM-NSD-template.yaml',
             'RIFTware_OpenStack': 'OS-RIFTware-template.yaml',
             'RIFTware_NSD_OpenStack': 'OS-RIFTware-NSD-template.yaml',
             'NONE_vCloud Director': 'VCD-NONE-template.xml',
             'VIO': 'VIO-template.yaml',
             'TOSCA_VIO': 'VIO-TOSCA-template.yaml',
             'OSM_VIO': 'VIO-OSM-template.yaml',
             'MultiVDU-vCloud Director-OSM' : 'MultiVDU-VCD-OSM-template.yaml' ,
             'MultiVDU-vCloud Director-OSM-NSD' : 'MultiVDU-VCD-OSM-NSD-template.yaml',
             'MultiVDU-OpenStack-OSM' : 'MultiVDU-OS-OSM-template.yaml' ,
             'MultiVDU-OpenStack-OSM-NSD' : 'MultiVDU-OS-OSM-NSD-template.yaml'}

session_dir = ''
multivdu_inputs = {}
multivdu_inputs['params'] = {}

def parse_argv():
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--inputs', required=True, metavar='<inputs_file_path>')
    return parser.parse_args()


def gen_name_and_workdir(inputs):
    params = inputs
    #params = inputs['params']
    #name = params['vnf_type'] + '-' + params['orch_type'] + '-'+ params['env_type']
    name = params['vim_params']['vnf_type'] + '-' + params['vim_params']['env_type'] + '-' + params['vim_params']['vnfd_name']
    name = name.replace(" ", "")    #Replacing Spaces in Dir names, as it causes problem parsing
    upload_dir = "/tmp/uploads"
    if not os.path.isdir(upload_dir):
       os.mkdir(upload_dir)
    user_dir =  os.path.join(upload_dir,params['username'])
    if not os.path.isdir(user_dir):
       os.mkdir(user_dir)
    print "user_dir = {}".format(user_dir)
    session_dir = os.path.join(user_dir, params['session_key'])
    if not os.path.isdir(session_dir):
       os.mkdir(session_dir)  
    print "session_dir = {}".format(session_dir)

    workdir = os.path.join(session_dir, name)
    workdir = workdir.replace(" ", "")  #Replacing Spaces in Dir names, as it causes problem parsing
    print "workdir = {}".format(workdir)
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
    rendered = Template(text).render(inputs)
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

def GetHashofDirs(directory, verbose=0):
  import hashlib, os
  SHAhash = hashlib.md5()
  if not os.path.exists (directory):
    return -1

  try:
    for root, dirs, files in os.walk(directory):
      for names in files:
        if verbose == 1:
          print 'Hashing', names
        filepath = os.path.join(root,names)
        try:
          f1 = open(filepath, 'rb')
        except:
          # You can't open the file for some reason
          f1.close()
          continue

        while 1:
          # Read file in as little chunks
          buf = f1.read(4096)
          if not buf : break
          SHAhash.update(hashlib.md5(buf).hexdigest())
        f1.close()

  except:
    import traceback
    # Print the stack traceback
    traceback.print_exc()
    return -2

  return SHAhash.hexdigest()

def create_vmdk_package(inputs, name, workdir):
    vmdk_dir = os.path.join(workdir, name + '_vmdk')
    os.mkdir(vmdk_dir)
    generate_standard_vmdk_blueprint(inputs, inputs['params'], vmdk_dir, name)
    if get_flavor_type(inputs['params']) == 'auto':
        generate_flavor_blueprint(inputs, inputs['params'], workdir, name)
    create_vmdk_manifest_file(name+'_vmdk', vmdk_dir)
    add_scripts(inputs['params'], vmdk_dir)   
    i = datetime.now()
    readme="VMDK descriptor package is generated. \nCreated on " + i.strftime('%Y/%m/%d %H:%M:%S')
    readme_file = os.path.join(vmdk_dir, 'README.txt') 
    with open(readme_file, 'w') as f:
        f.write(readme)
    vmdk_tar=shutil.make_archive(
        os.path.abspath(vmdk_dir),
        'gztar',
        os.path.dirname(vmdk_dir),
        name + '_vmdk')

    shutil.rmtree(vmdk_dir)

def create_osm_vnfd_package(inputs, name, workdir):
    vnfd_dir = os.path.join(workdir, name + '_vnfd')
    os.mkdir(vnfd_dir)
    charms_dir = os.path.join(vnfd_dir, 'charms')
    os.mkdir(charms_dir)
    cloud_init_dir = os.path.join(vnfd_dir, 'cloud_init')
    os.mkdir(cloud_init_dir)
    icons_dir = os.path.join(vnfd_dir, 'icons')
    os.mkdir(icons_dir)
    images_dir = os.path.join(vnfd_dir, 'images')
    os.mkdir(images_dir)
    add_scripts_osm(inputs, vnfd_dir)
    populate_distinct_networks(inputs)
    generate_standard_osm_blueprint(inputs, vnfd_dir, name)
    checksum = GetHashofDirs(vnfd_dir)
    checksums_file = os.path.join(vnfd_dir, 'checksums.txt')
    with open(checksums_file, 'w') as f:
        f.write(checksum)
    i = datetime.now()
    readme="Descriptor created by OSM descriptor package generated. \nCreated on " + i.strftime('%Y/%m/%d %H:%M:%S')
    readme_file = os.path.join(vnfd_dir, 'README.txt')
    with open(readme_file, 'w') as f:
        f.write(readme)
    vnfd_tar=shutil.make_archive(
        os.path.abspath(vnfd_dir),
        'gztar',
        os.path.dirname(vnfd_dir),
        name + '_vnfd')

    shutil.rmtree(vnfd_dir)
    return vnfd_tar

def create_osm_nsd_package(inputs, name, workdir):
    nsd_dir = os.path.join(workdir, name + '_nsd')
    os.mkdir(nsd_dir)
    ns_config_dir = os.path.join(nsd_dir, 'ns_config')
    os.mkdir(ns_config_dir)
    vnf_config_dir = os.path.join(nsd_dir, 'vnf_config')
    os.mkdir(vnf_config_dir)
    icons_dir = os.path.join(nsd_dir, 'icons')
    os.mkdir(icons_dir)
    scripts_dir = os.path.join(nsd_dir, 'scripts')
    os.mkdir(scripts_dir)
    #add_scripts(inputs, nsd_dir)
    generate_standard_osm_nsd_blueprint(inputs, nsd_dir, name)
    checksum = GetHashofDirs(nsd_dir)
    checksums_file = os.path.join(nsd_dir, 'checksums.txt')
    with open(checksums_file, 'w') as f:
        f.write(checksum)
    i = datetime.now()
    readme="Descriptor created by OSM descriptor package generated. \nCreated on " + i.strftime('%Y/%m/%d %H:%M:%S')
    readme_file = os.path.join(nsd_dir, 'README.txt')
    with open(readme_file, 'w') as f:
        f.write(readme)
    nsd_tar=shutil.make_archive(
        os.path.abspath(nsd_dir),
        'gztar',
        os.path.dirname(nsd_dir),
        name + '_nsd')
    shutil.rmtree(nsd_dir)
    return nsd_tar


#def populate_distinct_networks(inputs):
#    unique_networks = []
#    i = 0
#    num_nics_supported = 6
#    network_name = ''
#    while i < len(inputs['params']):
#        j = 1
#        while j < num_nics_supported:
#           nic_key = 'nic' + str(j) + '_name'
#           if nic_key in inputs['params'][i]:
#              network_name = inputs['params'][i]['nic' + str(j) + '_name']
#              print "1 = {}".format(network_name)
#              if network_name not in unique_networks :
#                  print "2 = {}".format(network_name)
#                  unique_networks.append(network_name)
#                  if 'unique_networks' not in inputs['vim_params']:
#                      print "3 = {}".format(network_name)
#                      inputs['vim_params']['unique_networks'] = []
#                      inputs['vim_params']['unique_networks'].append(network_name)
#                  else:
#                      print "4 = {}".format(network_name)
#                      inputs['vim_params']['unique_networks'].append(network_name)
#           j += 1
#        i += 1
#    print "unique_networks = {}".format(unique_networks)
#    #inputs['params']['vim_params']['unique_networks'] = unique_networks
#    print inputs

def populate_distinct_networks(inputs):
    unique_networks = []
    i = 0
    num_nics_supported = 10

    # Data structures to populate  information for OSM VNFD and NSD
    inputs['vim_params']['External_Networks'] = []
    inputs['vim_params']['Internal_Networks'] = []
    inputs['vim_params']['Network_Type'] = {}
    inputs['vim_params']['NetNameType'] = {}
    inputs['vim_params']['NetEtherNetType'] = {}
    inputs['vim_params']['NeworOldNetwork'] = {}
    inputs['vim_params']['Nics_External'] = []
    inputs['vim_params']['Nics_Internal'] = {}
    inputs['vim_params']['Nics_External_cp'] = {}
    for paramskey in inputs['vim_params'].keys():
	print "paramskey = {}".format(paramskey) 
        if re.match('Network(\d+)_name',paramskey):
          commonkey = paramskey.split('_')[0]
          print "commonkey={}".format(commonkey)
          netnum = re.search('Network(.+)',commonkey).group(1) 
          ethernetkey = 'Ethernet' +  netnum  + '_type'     
          print "ethernetkey={}".format(ethernetkey)
          netname = inputs['vim_params'][paramskey] 
          newnetkey = 'Create ' + commonkey
	  print "newnetykey = {}".format(newnetkey)
    
          #if 'External_Networks' not in inputs['vim_params']:
	  #inputs['vim_params']['External_Networks'] = []
	  #inputs['vim_params']['Internal_Networks'] = []
          #inputs['vim_params']['Network_Type'] = {}
          #inputs['vim_params']['NetNameType'] = {}
          #inputs['vim_params']['NetEtherNetType'] = {}
          #inputs['vim_params']['NeworOldNetwork'] = {}
          #inputs['vim_params']['Nics_External'] = []
          #inputs['vim_params']['Nics_Internal'] = {}
          #inputs['vim_params']['Nics_External_cp'] = {} 
          netname = inputs['vim_params'][paramskey]
          print "populate distinct networks = {}".format(str(netname))
          #newnetkey = 'Create ' + commonkey 
          print "newnetykey = {}".format(newnetkey)
          if inputs['vim_params'][commonkey + '_type'] == 'EXTERNAL':
             inputs['vim_params']['External_Networks'].append(inputs['vim_params'][paramskey])
             inputs['vim_params']['Network_Type'][str(netname)] = inputs['vim_params'][commonkey + '_type'] 
	     inputs['vim_params']['NetNameType'][str(netname)] =  inputs['vim_params'][commonkey + '_type'] 
             inputs['vim_params']['NetEtherNetType'][str(netname)] = inputs['vim_params'][ethernetkey]
             
             if newnetkey in inputs['vim_params']:
	        inputs['vim_params']['NeworOldNetwork'][str(netname)] = str(inputs['vim_params']['Create ' + commonkey ])  
	     else:
	        inputs['vim_params']['NeworOldNetwork'][str(netname)] = False
            
          else:
             inputs['vim_params']['Internal_Networks'].append(inputs['vim_params'][paramskey])
	     inputs['vim_params']['NetNameType'][str(netname)] =  inputs['vim_params'][commonkey + '_type']
	     inputs['vim_params']['NetEtherNetType'][str(netname)] = inputs['vim_params'][ethernetkey]
             if newnetkey in inputs['vim_params']: 
                inputs['vim_params']['NeworOldNetwork'][str(netname)] =  str(inputs['vim_params']['Create ' + commonkey ]) 
             else:
	        inputs['vim_params']['NeworOldNetwork'][str(netname)] = False  

    mgmt_network = inputs['vim_params']['mgmt_network']        
    inputs['vim_params']['External_Networks'].append(inputs['vim_params']['mgmt_network'])
    inputs['vim_params']['NetNameType'][mgmt_network] = 'EXTERNAL'
    #inputs['vim_params']['NetEtherNetType'][mgmt_network] = 'ELAN'
    inputs['vim_params']['NetEtherNetType'][mgmt_network] = inputs['vim_params']['mgmt_network_ethernet_type']
    #inputs['vim_params']['NeworOldNetwork'][mgmt_network] = 'False'
    inputs['vim_params']['NeworOldNetwork'][mgmt_network] = inputs['vim_params']['create_mgmt_network']
    print "Populate DS 1  inputs:{}".format(inputs)
    vmnum = 0
    for vmdata in inputs['params']:
	vmname = 'vm' + str(vmnum + 1) 
        vmdata['cpu'] = str(vmdata['cpu'])
        vmdata['ram'] = str(vmdata['ram'])
        vmdata['disk'] = str(vmdata['disk'])
        vmdata['NetNameType'] = inputs['vim_params']['NetNameType']
        vmdata['Network_Type'] = inputs['vim_params']['Network_Type']
        vmdata['Internal_Connection_Points'] = []
       

        if'create' in   vmdata['scripts']:
           if 'cloud_init_file' not in vmdata and vmdata['scripts']['create'][vmnum] != '':
               vmdata['cloud_init_file'] = ''
               vmdata['cloud_init_file'] = vmdata['scripts']['create'][vmnum]

        j = 1
  	while j < num_nics_supported:
           nic_key = 'nic' + str(j) + '_name'  
           interface_key = 'Interfaces' + str(j) + '_name'
           if interface_key in vmdata: 
              print "interfacekey = {},{}".format(interface_key,vmdata[interface_key])
	   if nic_key  in vmdata:
              netname = vmdata[nic_key] 
              print "netname = {}".format(netname)
              if netname in inputs['vim_params']['NetNameType'] :
	         vmdata['nic' + str(j) + '_type'] = inputs['vim_params']['NetNameType'][netname]   
                 if inputs['vim_params']['NetNameType'][netname] == "EXTERNAL":
                    inputs['vim_params']['Nics_External'].append(vmname + '_'+ nic_key)
                    if netname not in inputs['vim_params']['Nics_External_cp']:
                       inputs['vim_params']['Nics_External_cp'][netname] = []
                    inputs['vim_params']['Nics_External_cp'][netname].append(vmname + '_' + nic_key)
                    vmdata['nic' + str(j) + '_cp'] = vmname + '_'+ nic_key
                    if netname == inputs['vim_params']['mgmt_network']:
                       inputs['vim_params']['mgmt_network_cp'] = vmname + '_'+ nic_key
                 elif inputs['vim_params']['NetNameType'][netname] == "INTERNAL":
                       if netname not in inputs['vim_params']['Nics_Internal']:
                          print " populating Nics_Internal netname = {}".format(netname)
	                  inputs['vim_params']['Nics_Internal'][str(netname)] =  []
                       inputs['vim_params']['Nics_Internal'][netname].append(vmname + '_'+ nic_key)
                       vmdata['Internal_Connection_Points'].append(vmname + '_' + nic_key) 
	               vmdata['nic' + str(j) + '_cp'] = vmname + '_'+ nic_key

              if netname in inputs['vim_params']['NetNameType'] and inputs['vim_params']['NetNameType'][netname] == "INTERNAL":     
                 if 'vdu_internal_networks' not in vmdata:
                     vmdata['vdu_internal_networks'] = []
                 vmdata['vdu_internal_networks'].append(netname)
              if netname in inputs['vim_params']['NetEtherNetType'][str(netname)]:
	         vmdata['Ethernet' + str(j) + '_type'] = inputs['vim_params']['NetEtherNetType'][str(netname)]
           j += 1
        vmnum += 1
    print "inputs:{}".format(inputs)   
 
          
              
    

def add_scripts_osm(params,workdir):
    scripts_dir = os.path.join(workdir, 'scripts')
    cloud_init_dir = os.path.join(workdir, 'cloud_init')
    if not os.path.exists((os.path.join(workdir,'scripts'))):
       scripts_dir = os.path.join(workdir,'scripts')
       print("gb:scripts_dir:",scripts_dir)
       os.mkdir(scripts_dir)
    
    if not os.path.exists((os.path.join(workdir,'cloud_init'))):
       scripts_dir = os.path.join(workdir,'cloud_init')
       print("gb:scripts_dir:",cloud_init_dir)
       os.mkdir(scripts_dir)

    upload_dir = os.path.join('/tmp/uploads',params['username'])
    upload_scripts_dir = os.path.join(upload_dir,params['session_key'])
    print("gb:upload_scripts_dir:",upload_scripts_dir)
    if os.path.isdir(upload_scripts_dir):
       src_files = os.listdir(upload_scripts_dir)
       print("gb:list uploaded files:",src_files)
       for file_name in src_files:
           full_file_name = os.path.join(upload_scripts_dir, file_name)
           #print("Check create dict:%s",params[i]['scripts']);
           print("gb:full file name:",full_file_name)
           if (os.path.isfile(full_file_name)):
               print("print file name %s\n", os.path.basename(full_file_name))
               #shutil.copy(full_file_name, scripts_dir)
               shutil.copy(full_file_name, cloud_init_dir)


	
#def populate_distinct_networks(inputs):
#    final_list = []
#    for num in duplicate:
#        if num not in final_list:
#            final_list.append(num)
#    return final_list
     
def get_hash(fname, algo):
    import hashlib, os
    if algo == "SHA256":
        SHAhash = hashlib.sha256()
    elif algo == "MD5":
        SHAhash = hashlib.md5()
    else:
        print("Unknown SHA Algo. Exiting")
        return -2

    with open(fname, "rb") as f:
        for chunk in iter(lambda: f.read(2 ** 20), b""):
            SHAhash.update(chunk)

    print("{} Hash of file {}: {}".format(algo, fname, SHAhash.hexdigest()))
    return SHAhash.hexdigest()

def copy_scripts_for_riftware(params, workdir):
    print("scripts dict :",params['scripts'])

    upload_dir = os.path.join('/tmp/uploads',params['username'])
    upload_scripts_dir = os.path.join(upload_dir,params['session_key'])

    scripts_dir = os.path.join(workdir, 'scripts')
    os.mkdir(scripts_dir)

    if ('_vnfd' in workdir):
        cloud_init_dir = os.path.join(workdir, 'cloud_init')
        os.mkdir(cloud_init_dir)

    print("RIFT.io Scripts uploaded to temp folder: ",upload_scripts_dir)
    if os.path.isdir(upload_scripts_dir):
        src_files = os.listdir(upload_scripts_dir)
        print("RIFT.io - list of uploaded files in temp folder:",src_files)
        for file_name in src_files:
            full_file_name = os.path.join(upload_scripts_dir, file_name)
            print("Before copying RIFT.io script - check if this is a valid file:",full_file_name)
            if (os.path.isfile(full_file_name)):
                if (file_name in params['scripts']['create']):
                    if ('_vnfd' in workdir):
                        shutil.copy(full_file_name, cloud_init_dir)
                        print("Copied file {} to cloud_init dir\n".format(os.path.basename(full_file_name)))
                else:
                    shutil.copy(full_file_name, scripts_dir)
                    print("Copied file {} to scripts dir\n".format(os.path.basename(full_file_name)))

def create_vmdk_manifest_file(name, directory):
  print("VMDK - Creating VMDK manifest file for ****", name)
  print("VMDK - directory  ****", directory)
  SHA_ALGO = "SHA256"

  mf_name = name + ".mf"
  mf_file = os.path.join(directory, mf_name)
  with open(mf_file, 'a') as f:
    try:
      for root, dirs, files in os.walk(directory):
        for fileName in files:
          if fileName.endswith(".mf"):
            continue
          relDir = os.path.relpath(root, directory)
          relFile = os.path.join(relDir, fileName)
          print 'Hashing ', relFile
          filepath = os.path.join(root,fileName)
          if relDir == "images":
                    # Keep image checksum to be MD5 for now
                    # as glance/openstack supports only that
            file_hash = get_hash(filepath, "MD5")
          else:
            file_hash = get_hash(filepath, "SHA256")
          f.write("Source: {}\n".format(relFile))
          f.write("Algorithm: {}\n".format(SHA_ALGO))
          f.write("Hash: {}\n\n".format(file_hash))
    except:
      import traceback
      # Print the stack traceback
      traceback.print_exc()
      return -2
 
def create_riftware_manifest_file(name, directory):
  print("RIFT.io - Creating RIFT.ware manifest file for", name)
  VENDOR = "RIFT.io"
  VERSION = "1.0" 
  DATE_TIME = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
  SHA_ALGO = "SHA256"

  mf_name = name + ".mf"
  mf_file = os.path.join(directory, mf_name)
  with open(mf_file, 'a') as f:
    f.write("Product-Name: {}\n".format(name))
    f.write("Provider-ID: {}\n".format(VENDOR))
    f.write("Package-Version: {}\n".format(VERSION))
    f.write("Release-Date-Time: {}\n".format(DATE_TIME))
    f.write("Package-State: new\n\n")
    try:
      for root, dirs, files in os.walk(directory):
        for fileName in files:
          if fileName.endswith(".mf"):
            continue
          relDir = os.path.relpath(root, directory)
          relFile = os.path.join(relDir, fileName)
          print 'Hashing ', relFile
          filepath = os.path.join(root,fileName)
          if relDir == "images":
		    # Keep image checksum to be MD5 for now
		    # as glance/openstack supports only that
            file_hash = get_hash(filepath, "MD5")
          else:
            file_hash = get_hash(filepath, "SHA256")
          f.write("Source: {}\n".format(relFile))
          f.write("Algorithm: {}\n".format(SHA_ALGO))
          f.write("Hash: {}\n\n".format(file_hash))
    except:
      import traceback
      # Print the stack traceback
      traceback.print_exc()
      return -2

def create_riftware_vnfd_package(inputs, name, workdir):
    print("RIFT.io - Creating RIFT.ware VNFD Package")
    vnfd_dir = os.path.join(workdir, name + '_vnfd')
    os.mkdir(vnfd_dir)
    charms_dir = os.path.join(vnfd_dir, 'charms')
    os.mkdir(charms_dir)
    icons_dir = os.path.join(vnfd_dir, 'icons')
    os.mkdir(icons_dir)
    images_dir = os.path.join(vnfd_dir, 'images')
    os.mkdir(images_dir)
    copy_scripts_for_riftware(inputs['params'], vnfd_dir)

    generate_standard_riftio_blueprint(inputs['params'], vnfd_dir, name)
   
    create_riftware_manifest_file(name+'_vnfd', vnfd_dir)
    copy_README(inputs, workdir)

    vnfd_tar=shutil.make_archive(
        os.path.abspath(vnfd_dir),
        'gztar',
        os.path.dirname(vnfd_dir),
        name + '_vnfd')

    shutil.rmtree(vnfd_dir)
    print("RIFT.io - Done creating RIFT.ware VNFD Package")
    return vnfd_tar

def create_riftware_nsd_package(inputs, name, workdir):
    print("RIFT.io - Creating RIFT.ware NSD Package")
    nsd_dir = os.path.join(workdir, name + '_nsd')
    os.mkdir(nsd_dir)
    ns_config_dir = os.path.join(nsd_dir, 'ns_config')
    os.mkdir(ns_config_dir)
    vnf_config_dir = os.path.join(nsd_dir, 'vnf_config')
    os.mkdir(vnf_config_dir)
    icons_dir = os.path.join(nsd_dir, 'icons')
    os.mkdir(icons_dir)
    copy_scripts_for_riftware(inputs['params'], nsd_dir)

    generate_standard_riftio_nsd_blueprint(inputs['params'], nsd_dir, name)

    create_riftware_manifest_file(name+'_nsd', nsd_dir)
    copy_README(inputs, workdir)

    nsd_tar=shutil.make_archive(
        os.path.abspath(nsd_dir),
        'gztar',
        os.path.dirname(nsd_dir),
        name + '_nsd')

    shutil.rmtree(nsd_dir)
    print("RIFT.io - Done creating RIFT.ware NSD Package")
    return nsd_tar


#def get_orch_types(params):
#	orch = params['orch_type']
#	## TODO : (this is workaround) need to will handle Cloudify 4.0 in proper way.
#    
#	#if params['orch_type'] == 'Cloudify 4.0':
#	#   orch = 'Cloudify 3.4'
#	   
#	return orch 

def get_orch_types(params):
       orch = params['vim_params']['orch_type']
       ## TODO : (this is workaround) need to will handle Cloudify 4.0 in proper way.

       #if params['orch_type'] == 'Cloudify 4.0':
       #   orch = 'Cloudify 3.4'

       return orch

def get_git_flag(params):
     uploadflag = params['vim_params']['git_upload']
     return uploadflag 

def get_env_types(params):
     env = params['vim_params']['env_type']
     return env 

def get_disk_capacity_in_bytes(params):
     disk_in_bytes = params['vim']
     return disk_in_bytes

def get_vnf_types(params):
     vnf = params['vim_params']['vnf_type']
     return vnf 

def get_flavor_type(params):
     flavor = params['flavor']
     return flavor 

def add_scripts(params,workdir):
    scripts_dir = os.path.join(workdir, 'scripts')
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
           #print("Check create dict:%s",params[i]['scripts']);
           print("gb:full file name:",full_file_name)
           if (os.path.isfile(full_file_name)):
               print("print file name %s\n", os.path.basename(full_file_name))
               shutil.copy(full_file_name, scripts_dir)

#def add_scripts(params, workdir):
#    #params['scripts'] = None if all(not s for p, s in params['scripts'].iteritems()) else params['scripts']
#    #print("add_scripts: %s\n",params)
#    #scripts = params['scripts']
#    #print("scripts dict :%s\n",params['scripts'])
#    scripts_dir = ''
#    
#    if params['scripts']:
#        scripts_dir = os.path.join(workdir, 'scripts')
#        os.mkdir(scripts_dir)
#        #if os.path.isdir('/tmp/uploads/'):
#        #   print("Uploading File in /tmp/uploads")
#        #   shutil.copytree('/tmp/uploads',scripts_dir)
#        
#
##        for phase, script in scripts.iteritems():
##            if script:
##                if validators.url(script):
##                    body, ext = get_file_from_url(script)
##                else:
##                    body, ext = script, ''
##                write_scripts_file(scripts_dir, phase, ext, body)
##                params['scripts'][phase] = os.path.join('scripts', phase + '.' + ext)
#
#    if not os.path.exists((os.path.join(workdir,'scripts'))):
#        scripts_dir = os.path.join(workdir,'scripts')
#        print("gb:scripts_dir:",scripts_dir)
#        os.mkdir(scripts_dir)
#    upload_dir = os.path.join('/tmp/uploads',params['username'])
#    upload_scripts_dir = os.path.join(upload_dir,params['session_key'])
#    print("gb:upload_scripts_dir:",upload_scripts_dir)
#    if os.path.isdir(upload_scripts_dir):
#       src_files = os.listdir(upload_scripts_dir)
#       print("gb:list uploaded files:",src_files)
#       for file_name in src_files:
#			full_file_name = os.path.join(upload_scripts_dir, file_name)
#			print("Check create dict:%s",params['scripts']); 
#			print("gb:full file name:",full_file_name)
#			if (os.path.isfile(full_file_name)):
#				print("print file name %s\n", os.path.basename(full_file_name))
#				shutil.copy(full_file_name, scripts_dir)
#   
def generate_cloudify_blueprint(params, workdir, name):
   #template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES[params['env_type']])) 
    template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES[params['vim_params']['env_type']]))
    print("Inside generate cloudify blueprint :%s\n",params)
    print("Print Template : %s\n",template)
    out = template.render(params)
    out_file = os.path.join(workdir, name + '.yaml')
    with open(out_file, 'w') as f:
        f.write(out)

def generate_standard_osm_blueprint(params, workdir, name):
    template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES['MultiVDU-' + params['vim_params']['env_type'] + '-OSM' ]))
    out = template.render(params)
    out_file = os.path.join(workdir, name + '-vnfd.yaml')
    with open(out_file, 'w') as f:
        f.write(out)

def generate_standard_osm_nsd_blueprint(params, workdir, name):
    template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES['MultiVDU-' + params['vim_params']['env_type'] + '-OSM-NSD']))
    out = template.render(params)
    out_file = os.path.join(workdir, name + '-nsd.yaml')
    with open(out_file, 'w') as f:
        f.write(out)

def generate_standard_riftio_blueprint(params, workdir, name):
    template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES['RIFTware_' + params['env_type']]))
    out = template.render(params)
    out_file = os.path.join(workdir, name + '_vnfd.yaml')
    with open(out_file, 'w') as f:
        f.write(out)

def generate_standard_riftio_nsd_blueprint(params, workdir, name):
    template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES['RIFTware_NSD_' + params['env_type']]))
    out = template.render(params)
    out_file = os.path.join(workdir, name + '_nsd.yaml')
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
    
def generate_standard_vmdk_blueprint(inputs, params, workdir, name):
    template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES['NONE_' + params['env_type']]))
    out = template.render(params)
    if get_env_types(inputs['params']) == 'OpenStack':
        out_file = os.path.join(workdir, name + '.yaml')
    else: 
        out_file = os.path.join(workdir, name + '.ovf')
    with open(out_file, 'w') as f:
        f.write(out)

def generate_standard_heat_blueprint(params, workdir, name):
    template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES['NONE_' + params['env_type']]))
    out = template.render(params)
    out_file = os.path.join(workdir, name + '.yaml')
    with open(out_file, 'w') as f:
        f.write(out)

def generate_standard_tosca_blueprint(params, workdir, name):
    template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES['TOSCA_' + params['env_type']]))
    out = template.render(params)
    out_file = os.path.join(workdir, name + '-TOSCA.yaml')
    with open(out_file, 'w') as f:
        f.write(out)
    shutil.copytree(os.path.join(TEMPLATES_DIR, 'types'), os.path.join(workdir, 'types'))

def generate_flavor_blueprint(params, workdir, name):
    if get_orch_types(params) == 'NONE':
        template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES['HEAT_CUSTOM_FLAVOR']))
    else:
        template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES['CUSTOM_FLAVOR']))
    out = template.render(params)
    out_file = os.path.join(workdir, 'CUSTOM-FLAVOR.yaml')
    with open(out_file, 'w') as f:
        f.write(out)

def copy_inputs_template(params, workdir):
    inputs_name = params['vim_params']['env_type'] + '-inputs.yaml'
    name = inputs_name.replace(" ", "")    #Replacing Spaces in Dir names, as it causes problem parsing
    shutil.copyfile(os.path.join(TEMPLATES_DIR, inputs_name), os.path.join(workdir, name))


def remove_file(filepath):
    os.remove(filepath)


def create_blueprint_package(inputs):
    name, workdir = gen_name_and_workdir(inputs)
    try:
        create_work_dir(workdir)
        if get_orch_types(inputs['params']) not in ['OSM 3.0', 'RIFT.ware 5.3', 'NONE']:
           add_scripts(inputs['params'], workdir)
           copy_README(inputs, workdir)
        print "The input parameter is ", get_orch_types(inputs['params']) 
        print "The git flag is ", get_git_flag(inputs['params']) 
        print "The input list parameter is ", inputs['params'] 
        commit_comment=get_env_types(inputs['params']) + '_' + get_orch_types(inputs['params']) + '_'+ get_vnf_types(inputs['params'])
        orch_name= get_orch_types(inputs['params'])
        env_name= get_env_types(inputs['params'])
        vnf_name= get_vnf_types(inputs['params'])
        if get_orch_types(inputs['params']) == 'Cloudify 3.4' or get_orch_types(inputs['params']) == 'Cloudify 4.0' or get_orch_types(inputs['params']) == 'Cloudify 4.3' : 
            generate_cloudify_blueprint(inputs['params'], workdir, name)
            if get_flavor_type(inputs['params']) == 'auto':
                 generate_flavor_blueprint(inputs, inputs['params'], workdir, name)
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
           vnfd_package=create_osm_vnfd_package(inputs, name, workdir)
           nsd_package=create_osm_nsd_package(inputs, name, workdir)
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
           #generate_riftio_package(inputs['params'], workdir, name, True)
           vnfd_package = create_riftware_vnfd_package(inputs, name, workdir)
           nsd_package = create_riftware_nsd_package(inputs, name, workdir)
           output_file = create_package(name, workdir)
           return output_file, workdir
        elif get_orch_types(inputs['params']) == 'NONE':
            if get_env_types(inputs['params']) == 'OpenStack':
               generate_standard_heat_blueprint(inputs['params'], workdir, name)
               if get_flavor_type(inputs['params']) == 'Custom Flavor':
                   generate_flavor_blueprint(inputs, inputs['params'], workdir, name)
               copy_inputs_template(inputs['params'], workdir)
               output_file = create_package(name, workdir)
               print "Got the output file", output_file
               print "Got the working directory",workdir
               print "The git flag outside ", get_git_flag(inputs['params'])
               if get_git_flag(inputs['params']) == True:
                   print "The git flag inside ", get_git_flag(inputs['params'])
                   Process=subprocess.call(['./git_upload.sh', output_file, workdir, commit_comment, orch_name, env_name])
               return output_file, workdir
            else:
               vmdk_package=create_vmdk_package(inputs, name, workdir)
               output_file = create_package(name, workdir)
               print "The git flag outside ", get_git_flag(inputs['params'])
               if get_git_flag(inputs['params']) == True:
                  print "The git flag inside ", get_git_flag(inputs['params'])
                  Process=subprocess.call(['./git_upload.sh', output_file, workdir, commit_comment, orch_name, env_name, vnf_name])
               return output_file, workdir
        elif get_orch_types(inputs['params']) == 'TOSCA 1.1':
           generate_standard_tosca_blueprint(inputs['params'], workdir, name)
           if get_env_types(inputs['params']) == 'OpenStack':
               if get_flavor_type(inputs['params']) == 'Custom Flavor':
                   generate_flavor_blueprint(inputs, inputs['params'], workdir, name)
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

def create_multivdu_blueprint_package(inputs):
    name, workdir = gen_name_and_workdir(inputs)
    try:
       create_work_dir(workdir)
       #if get_orch_types(inputs['params']) not in ['OSM 3.0', 'RIFT.ware 5.3', 'NONE']:
       if get_orch_types(inputs) not in ['OSM 3.0', 'RIFT.ware 5.3', 'NONE']:
          add_scripts(inputs, workdir)
          copy_README(inputs, workdir)
       print "The input parameter is ", get_orch_types(inputs)
       print "The git flag is ", get_git_flag(inputs)
       print "The input list parameter is ", inputs
       commit_comment=get_env_types(inputs) + '_' + get_orch_types(inputs) + '_'+ get_vnf_types(inputs)
       orch_name = get_orch_types(inputs)
       env_name= get_env_types(inputs)
       vnf_name= get_vnf_types(inputs)

       if get_orch_types(inputs) == 'Cloudify 3.4' or get_orch_types(inputs) == 'Cloudify 4.0' or get_orch_types(inputs) == 'C loudify 4.3' :
          generate_cloudify_blueprint(inputs, workdir, name)
          for vm in inputs['params']:
              print "data ****************", vm['flavor']
              if vm['flavor'] == 'auto':
                  generate_flavor_blueprint(inputs,workdir, name)
          copy_inputs_template(inputs, workdir)
          output_file = create_package(name, workdir)
          print "The git flag outside ", get_git_flag(inputs)
          if get_git_flag(inputs) == True:
             print "The git flag inside ", get_git_flag(inputs)
             print("params for git upload : output file = %s\n, workdir = %s\n,orch_name = %s\n,commit_comment = %s\n",output_file, workdir, orch_name, commit_comment)
#                Process=subprocess.call(['./git_upload.sh', output_file, workdir, orch_name, commit_comment])
             Process=subprocess.call(['./git_upload.sh', output_file, workdir, commit_comment, orch_name, env_name, vnf_name])
#                Process=subprocess.call(['./git_upload.sh', output_file, workdir])
#            Process=subprocess.call(['./git_upload.sh', output_file, workdir])
          return output_file, workdir
       elif get_orch_types(inputs) == 'OSM 3.0':
           vnfd_package=create_osm_vnfd_package(inputs, name, workdir)
           nsd_package=create_osm_nsd_package(inputs, name, workdir)
           output_file = create_package(name, workdir)
           print "The git flag outside ", get_git_flag(inputs)
           if get_git_flag(inputs) == True:
               print "The git flag inside ", get_git_flag(inputs)
#               Process=subprocess.call(['./git_upload.sh', output_file, workdir])
               Process=subprocess.call(['./git_upload.sh', output_file, workdir, commit_comment, orch_name, env_name, vnf_name])
#           Process=subprocess.call(['./git_upload.sh', output_file, workdir])
           return output_file, workdir

    finally:
       print("inside finally")
       cleanup(workdir)

def convert_payload_to_json(inputs):
    print "convert_payload_to_json:",inputs
    inputkeys = inputs['params'].keys()
    print "inputkeys={}".format(inputkeys) 
    #if 'number_of_vms' in inputs.keys():
    #pdb.set_trace()
    
    if 'vnf_num_vms' in inputs['params'].keys():
        number_of_vms = inputs['params']['vnf_num_vms']
        for x in range (0,number_of_vms):
           vm_index = 'VM' + '_' + str(x + 1)
           multivdu_inputs[vm_index] = {}
    for paramskey in inputs['params'].keys():
        print "paramvalue = {}".format(inputs['params'][paramskey])
        #BEGIN:populate vnf-wide parameters
        if paramskey == 'env_type':
           multivdu_inputs['vim'] = inputs['params'][paramskey] 
        if paramskey == 'vnfd_name':
           multivdu_inputs['vnfd_name'] = inputs['params'][paramskey]
        if paramskey == 'orch_type':
           multivdu_inputs['Orchestrator'] = inputs['params'][paramskey]
        if paramskey == 'vnf_type':
           multivdu_inputs['vnf_type'] = inputs['params'][paramskey]
        if paramskey == 'vnf_description':
           multivdu_inputs['vnf_description'] = inputs['params'][paramskey]
        if paramskey == 'git_upload':
           multivdu_inputs['git_upload'] = inputs['params'][paramskey]
        if paramskey == 'username':
           multivdu_inputs['username'] = inputs['params'][paramskey]
        if paramskey == 'session_key':
           multivdu_inputs['session_key'] = inputs['params'][paramskey]
        #END:populate vnf-wide parameters

	   #BEGIN: populate vdu parameters
        if paramskey == 'image_id':
          index = 1
          for image in inputs['params'][paramskey]:
              print "images={}".format(image)
              for keys in multivdu_inputs.keys():
		      print keys
	              if re.match('VM_*',keys):
                         print "matched_keys={}".format(keys)
                         k_comp = keys.split("-")
                         print k_comp
                         if int(k_comp[1]) == index:
                            multivdu_inputs[keys]['image-id'] = image
              index += 1  

        if paramskey == 'ram':
         index = 1
         for ram in inputs['params'][paramskey]:
             print "ram={}".format(ram)
             for keys in multivdu_inputs.keys():
                 print keys
                 if re.match('VM_*',keys):
                     print "matched_keys={}".format(keys)
                     k_comp = keys.split("-")
                     print k_comp
                     if int(k_comp[1]) == index:
       	                  multivdu_inputs[keys]['ram'] = ram
             index += 1

        if paramskey == 'cpu':
          index = 1
          for cpu in inputs['params'][paramskey]:
             print "cpu={}".format(cpu)
             for keys in multivdu_inputs.keys():
                 print keys
                 if re.match('VM_*',keys):
                     print "matched_keys={}".format(keys)
                     k_comp = keys.split("-")
                     print k_comp
                     if int(k_comp[1]) == index:
                        multivdu_inputs[keys]['cpu'] = cpu
             index += 1
 
        if paramskey == 'disk':
           index = 1
           for disk in inputs['params'][paramskey]:
              print "disk={}".format(disk)
              for keys in multivdu_inputs.keys():
                  print keys
                  if re.match('VM_*',keys):
                     print "matched_keys={}".format(keys)
                     k_comp = keys.split("-")
                     print k_comp
                     if int(k_comp[1]) == index:
                        multivdu_inputs[keys]['disk'] = disk
              index += 1
		
	
        if paramskey == 'flavorname': 
           index = 1
           for flavorname in inputs['params'][paramskey]:
              print "flavorname={}".format(flavorname)
	      for keys in multivdu_inputs.keys():
                 print keys
                 if re.match('VM_*',keys):
                   print "matched_keys={}".format(keys)
                   k_comp = keys.split("-")
                   print k_comp
                   if int(k_comp[1]) == index:
                       multivdu_inputs[keys]['flavorname'] = flavorname
              index += 1      


        if paramskey == 'flavor':
          index = 1
          for flavor in inputs['params'][paramskey]:
            print "flavorname={}".format(flavor)
	    for keys in multivdu_inputs.keys():
              print keys
              if re.match('VM_*',keys):
                  print "matched_keys={}".format(keys)
                  k_comp = keys.split("-")
                  print k_comp
                  if int(k_comp[1]) == index:
                     multivdu_inputs[keys]['flavor'] = flavor
          index += 1

        if paramskey == 'latency_sensitivity':
         index = 1
         for latency_sensitivity in inputs['params'][paramskey]:
               print "latency_sensitivityy={}".format(latency_sensitivity)
               for keys in multivdu_inputs.keys():
                   print keys
                   if re.match('VM_*',keys):
                      print "matched_keys={}".format(keys)
                      k_comp = keys.split("-")
                      print k_comp
                      if int(k_comp[1]) == index:
                         multivdu_inputs[keys]['latency_sensitivity'] = latency_sensitivity
               index += 1


        if paramskey == 'memory_reservation':
           index = 1
           print "inside mem reservation"
           for mem_reservation in inputs['params'][paramskey]:
               print "mem_reservation={}".format(mem_reservation)
               for keys in multivdu_inputs.keys():
                   print keys
                   if re.match('VM_*',keys):
                       print "matched_keys={}".format(keys)
                       k_comp = keys.split("-")
                       print k_comp
                       if int(k_comp[1]) == index:
                          multivdu_inputs[keys]['memory_reservation'] = mem_reservation
               index += 1



        if paramskey == 'nic1_name':
           for keys in multivdu_inputs.keys():
               print "multivdu_inputs keys = {}".format(keys)

               if re.match('VM_*',keys):
#pdb.set_trace()
                   print "matched_keys={}".format(keys)
                   k_comp = keys.split("-")
                   print k_comp
                   len = inputs['params'][paramskey]
                   networks = inputs['params'][paramskey]
                   print "network_name = {}".format(networks)

                   if 'network_names' not in multivdu_inputs[keys]:
                       multivdu_inputs[keys]['network_names'] = []
#multivdu_inputs[keys]['network_names'].append(networks[int(k_comp[1]) - 1])
                       multivdu_inputs[keys]['network_names'].insert(0,networks[int(k_comp[1]) - 1])
                   else:
#multivdu_inputs[keys]['network_names'].append(networks[int(k_comp[1]) -1])
                       multivdu_inputs[keys]['network_names'].insert(0,networks[int(k_comp[1]) -1])
					  
        if paramskey == 'nic2_name':
           for keys in multivdu_inputs.keys():
               print "multivdu_inputs keys = {}".format(keys)

               if re.match('VM_*',keys):
                   print "matched_keys={}".format(keys)
                   k_comp = keys.split("-")
                   print k_comp
                   len = inputs['params'][paramskey]
                   networks = inputs['params'][paramskey] 
                   print "networks = {}".format(networks)

                   if 'network_names' not in multivdu_inputs[keys]:
                       multivdu_inputs[keys]['network_names'] = []
#multivdu_inputs[keys]['network_names'].append(networks[int(k_comp[1]) - 1])
                       multivdu_inputs[keys]['network_names'].insert(1,networks[int(k_comp[1]) - 1])
                   else:
                       multivdu_inputs[keys]['network_names'].insert(1,networks[int(k_comp[1]) -1])

        if paramskey == 'nic3_name':
           for keys in multivdu_inputs.keys():
               print "multivdu_inputs keys = {}".format(keys)

               if re.match('VM_*',keys):
                   print "matched_keys={}".format(keys)
                   k_comp = keys.split("-")
                   print k_comp
                   len = inputs['params'][paramskey]
                   networks = inputs['params'][paramskey] 
                   print "networks = {}".format(networks)
                   if 'network_names' not in multivdu_inputs[keys]:
                       multivdu_inputs[keys]['network_names'] = []
                       multivdu_inputs[keys]['network_names'].insert(2,networks[int(k_comp[1]) - 1])
                   else:
                       multivdu_inputs[keys]['network_names'].insert(2,networks[int(k_comp[1]) -1])

        if paramskey == 'nic4_name':
           for keys in multivdu_inputs.keys():
               print "multivdu_inputs keys = {}".format(keys)

               if re.match('VM_*',keys):
                   print "matched_keys={}".format(keys)
                   k_comp = keys.split("-")
                   print k_comp
                   len = inputs['params'][paramskey]
                   networks = inputs['params'][paramskey]
                   print "networks = {}".format(networks)
                   if 'network_names' not in multivdu_inputs[keys]:
                       multivdu_inputs[keys]['network_names'] = []
                       multivdu_inputs[keys]['network_names'].insert(3,networks[int(k_comp[1]) - 1])
                   else:
                       multivdu_inputs[keys]['network_names'].insert(3,networks[int(k_comp[1]) -1])


        if paramskey == 'nic5_name':
           for keys in multivdu_inputs.keys():
               print "multivdu_inputs keys = {}".format(keys)

               if re.match('VM_*',keys):
                   print "matched_keys={}".format(keys)
                   k_comp = keys.split("-")
                   print k_comp
                   len = inputs['params'][paramskey]
                   networks = inputs['params'][paramskey]
                   print "networks = {}".format(networks)
                   if 'network_names' not in multivdu_inputs[keys]:
                       multivdu_inputs[keys]['network_names'] = []
                       multivdu_inputs[keys]['network_names'].insert(4,networks[int(k_comp[1]) - 1])
                   else:
                        multivdu_inputs[keys]['network_names'].insert(4,networks[int(k_comp[1]) -1])



        if paramskey == 'nic6_name':
           for keys in multivdu_inputs.keys():
               print "multivdu_inputs keys = {}".format(keys)

               if re.match('VM_*',keys):
                   print "matched_keys={}".format(keys)
                   k_comp = keys.split("-")
                   print k_comp
                   len = inputs['params'][paramskey]
                   networks = inputs['params'][paramskey]
                   print "networks = {}".format(networks)
                   if 'network_names' not in multivdu_inputs[keys]:
                       multivdu_inputs[keys]['network_names'] = []
                       multivdu_inputs[keys]['network_names'].insert(5,networks[int(k_comp[1]) - 1])
                   else:
                       multivdu_inputs[keys]['network_names'].insert(5,networks[int(k_comp[1]) -1])


        if paramskey == 'Interfaces1_name':
           for keys in multivdu_inputs.keys():
               print "multivdu_inputs keys = {}".format(keys)
               if re.match('VM_*',keys):
                   print "matched_keys={}".format(keys)
                   k_comp = keys.split("-")
                   print k_comp
                   len = inputs['params'][paramskey]
                   networks = inputs['params'][paramskey]
                   print "networks = {}".format(networks)
                   if 'nic_types' not in multivdu_inputs[keys]:
                       multivdu_inputs[keys]['nic_types'] = []
                       multivdu_inputs[keys]['nic_types'].insert(0,networks[int(k_comp[1]) - 1])
                   else:
                       multivdu_inputs[keys]['nic_types'].insert(0,networks[int(k_comp[1]) -1])

        
        
        if paramskey == 'Interfaces2_name':
          for keys in multivdu_inputs.keys():
               print "multivdu_inputs keys = {}".format(keys)

               if re.match('VM_*',keys):
                   print "matched_keys={}".format(keys)
                   k_comp = keys.split("-")
                   print k_comp
                   len = inputs['params'][paramskey]
                   networks = inputs['params'][paramskey]
                   print "networks = {}".format(networks)
                   if 'nic_types' not in multivdu_inputs[keys]:
                       multivdu_inputs[keys]['nic_types'] = []
                       multivdu_inputs[keys]['nic_types'].insert(1,networks[int(k_comp[1]) - 1])
                   else: 
                       multivdu_inputs[keys]['nic_types'].insert(1,networks[int(k_comp[1]) -1])


        if paramskey == 'Interfaces3_name':
           for keys in multivdu_inputs.keys():
               print "multivdu_inputs keys = {}".format(keys)

               if re.match('VM_*',keys):
                   print "matched_keys={}".format(keys)
                   k_comp = keys.split("-")
                   print k_comp
                   len = inputs['params'][paramskey]
                   networks = inputs['params'][paramskey]
                   print "networks = {}".format(networks)
                   if 'nic_types' not in multivdu_inputs[keys]:
                       multivdu_inputs[keys]['nic_types'] = []
                       multivdu_inputs[keys]['nic_types'].insert(2,networks[int(k_comp[1]) - 1])
                   else:
                       multivdu_inputs[keys]['nic_types'].insert(2,networks[int(k_comp[1]) -1]) 
   


        if paramskey == 'Interfaces4_name':
           for keys in multivdu_inputs.keys():
	       print "multivdu_inputs keys = {}".format(keys)

	       if re.match('VM_*',keys):
                  print "matched_keys={}".format(keys)
	          k_comp = keys.split("-")
	          print k_comp
	          len = inputs['params'][paramskey]
	          networks = inputs['params'][paramskey]
                  print "networks = {}".format(networks)
                  if 'nic_types' not in multivdu_inputs[keys]:
		      multivdu_inputs[keys]['nic_types'] = []
                      multivdu_inputs[keys]['nic_types'].insert(2,networks[int(k_comp[1]) - 1])
                  else:
                      multivdu_inputs[keys]['nic_types'].insert(2,networks[int(k_comp[1]) -1])                       
                       
#                       if paramskey == 'Interfaces1_name':
#        o_index = 1
#        for keys in multivdu_inputs.keys():
#            print keys
#
#            if re.match('VM-*',keys):
#                print "matched_keys={}".format(keys)
#                k_comp = keys.split("-")
#                print k_comp
##if int(k_comp[1]) == index:
#                i_index = 1
#                for nic_type in inputs['params'][paramskey]:
#                if o_index == i_index:
#                           if 'nic_types' not in multivdu_inputs[keys]:
#                               multivdu_inputs[keys]['nic_types'] = []
#                               multivdu_inputs[keys]['nic_types'].append(nic_type)
#                           else:
#                                multivdu_inputs[keys]['nic_types'].append(nic_type)
#                       i_index += 1
#                   o_index += 1 	 
#	     
#
#
#        if paramskey == 'Interfaces2_name':
#           o_index = 1
#           for keys in multivdu_inputs.keys():
#               print keys
#
#               if re.match('VM-*',keys):
#                  print "matched_keys={}".format(keys)
#                  k_comp = keys.split("-")
#                  print k_comp
#                  #if int(k_comp[1]) == index:
#                  i_index = 1
#                  for nic_type in inputs['params'][paramskey]:
#                      if o_index == i_index:
#                         if 'nic_types' not in multivdu_inputs[keys]:
#                             multivdu_inputs[keys]['nic_types'] = []
#                             multivdu_inputs[keys]['nic_types'].append(nic_type)
#                         else:
#                             multivdu_inputs[keys]['nic_types'].append(nic_type)
#                      i_index += 1
#                  o_index += 1
#
#
#         
#        if paramskey == 'Interfaces3_name':
#           o_index = 1
#           for keys in multivdu_inputs.keys():
#               print keys
#
#               if re.match('VM-*',keys):
#                  print "matched_keys={}".format(keys)
#                  k_comp = keys.split("-")
#                  print k_comp
#                  #if int(k_comp[1]) == index:
#                  i_index = 1
#                  for nic_type in inputs['params'][paramskey]:
#                      if o_index == i_index:
#                         if 'nic_types' not in multivdu_inputs[keys]:
#                             multivdu_inputs[keys]['nic_types'] = []
#                             multivdu_inputs[keys]['nic_types'].append(nic_type)
#                         else:
#                             multivdu_inputs[keys]['nic_types'].append(nic_type)
#                      i_index += 1
#                  o_index += 1
#

    print "multivdu_inputs={}".format(multivdu_inputs)
    return multivdu_inputs



if __name__ == '__main__':
    #args = parse_argv()
    #with open(args.inputs) as f:
    #    inputs = yaml.load(f.read())
    #    output_file, workdir = create_blueprint_package(inputs)
    #    print "Got the output file", output_file
        #Process=subprocess.Popen('./git_upload.sh %s' % (str(output_file)))
       # subprocess.call(["git_upload.sh","output_file"],shell=True)
    #inputs = '{"params": { "Interfaces1_name": ["VIRTIO", "PCI-PASSTHOUGH", "DIRECT"],"Interfaces2_name": [" ","E1000", "SR-IOV"], "git_upload": "False", "orch_type": "OSM 3.0","ram": ["1024", "2048", "4096"],"nic1_name": ["FlatNet", "system", "DIRECT"],"nic2_name": ["FLATNET", "COOL", "DAYLIGHT"],"flavorname": "","env_type": "OpenStack","image_id": ["ubuntu ", "multi_nic ", "ubuntu1_nic"],"memory_reservation": ["True", "Flase", "True"],"numa_affinity": ["True", "False", "True", "False"],"scripts": { "create": ""},"vnf_type": "vRouter", "number_numa_node": ["0", "1", "3", "4"],"vnfd_name": "singlevdu", "flavor": ["test"," ","trial"],"disk": ["10", "20", "30"],"cpu": ["1", "2", "3", "2", "2"], "latency_sensitivity": ["True", "False", "True"],"number_of_vms" : 4 ,"flavorname": ["m1.small"," " ,"m1.large"]}}'

    #inputs = '{"params":{"env_type":"vCloud Director","orch_type":"Cloudify 4.0","vnf_type":"vRouter","vnfd_name":"TestVNF","vnf_num_vms":2,"image_id":["Test","Ubuntu","","","",""],"Flavor":["2","2","2","2","2","2"],"flavorname":["","","","","",""],"number_numa_node":0,"scripts":{"create":["","","","","",""],"config":["","","","","",""],"delete":["","","","","",""]},"git_upload":false,"nic_1_name":["Mgmt","FlatNet","","","",""],"nic_2_name":["Mgmt","","","","",""],"nic_3_name":["","","","","",""],"nic_4_name":["","","","","",""],"nic_5_name":["","","","","",""],"nic_6_name":["","","","","",""],"Interfaces1_name":["Default","Default","","","",""],"Interfaces2_name":["Default","","","","",""],"Interfaces3_name":["Select Type","","","","",""],"Interfaces4_name":["Select Type","","","","",""],"Interfaces5_name":["Select Type","","","","",""],"Interfaces6_name":["Select Type","","","","",""]}}'

   #inputs = '{"params":{"env_type":"vCloud Director","orch_type":"TOSCA 1.1","vnf_type":"vRouter","vnfd_name":"Test","vnf_num_vms":2, "image_id":["Ubuntu","ubuntu","","","",""],"Flavor":["2","2","2","2","2","2"],"flavorname":["","","","","",""],"numa_affinity":[true,false,false,false,false,false], "memory_reservation":[true,false,false,false,false,false],"latency_sensitivity":[true,false,false,false,false,false],"number_numa_node":[1,1,1,1,1,1], "scripts":{"create":["","","","","",""],"config":["","","","","",""],"delete":["","","","","",""]},"git_upload":false,"nic1_name":["Mgmt","bank","Insurance","","",""],"nic2_name":["Mgmt","Retail","","","",""],"nic3_name":["","","","","",""], "nic4_name":["","","","","",""],"nic5_name":["","","","","",""],"nic_6_name":["","","","","",""],"Interfaces1_name":["E1000","VMXNET3","E1000","","",""],"Interfaces2_name":["VMXNET3","E1000","","","",""],"Interfaces3_name":["Select Type","","","","",""],"Interfaces4_name":["Select Type","","","","",""],"Interfaces5_name":["Select Type","","","","",""],"Interfaces6_name":["Select Type","","","","",""]}}'

   inputs = '{"params": {"Internal_Connection_Points": ["vm1_nic1_name"], "NetNameType": {"mgt": "EXTERNAL", "eth0": "INTERNAL"},"Interfaces1_name": "PCI-PASSTHROUGH", "Network_Type": {}, "nic1_cp": "vm1_nic1_name", "ram": "1024","vdu_internal_networks": ["eth0"], "nic1_name": "eth0", "flavorname": "", "image_id": "ubunt", "nic1_type": "INTERNAL", "memory_reservation": False, "numa_affinity": False, "scripts": {"create": ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]}, "number_numa_node": 1, "flavor": "2", "disk": "10", "cpu": "1", "latency_sensitivity": False}}'
   input_json = json.loads(inputs)
   convert_payload_to_json(input_json) 
   cleanup(workdir)
