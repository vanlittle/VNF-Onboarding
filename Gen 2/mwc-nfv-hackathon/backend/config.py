#!/usr/bin/python

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
 
###########################################################################


from configparser import ConfigParser
 
 
def db_config(filename='database.ini', section='postgresql'):
    print(filename)
    print(section)
    # create a parser
    parser = ConfigParser()
    # read config file
    parser.read(filename)
 
    # get section, default to postgresql
    db = {}
    if parser.has_section(section):
        print(section)
        params = parser.items(section)
        for param in params:
            print(param)
            db[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))
    #print(db) 
    return db

def get_config_param(filename,section,param_name):
    # create a parser
    parser = ConfigParser()
    # read config file
    parser.read(filename)

    # get section, default to postgresql
    db = {}
    if parser.has_section(section):
       print(section)
       params = parser.items(section)
       print(params)
       for param in params:
         print(param)
         if param[0] == param_name:
           print(param[1])
           return param[1]

if __name__ == '__main__':
    db_config()
    get_config_param('database.ini','Details','table')
