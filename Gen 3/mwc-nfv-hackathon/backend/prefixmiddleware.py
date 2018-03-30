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

class PrefixMiddleware(object):

   def __init__(self, app, prefix=''):
       self.app = app
       self.prefix = prefix

   def __call__(self, environ, start_response):

       print "inside prefixmiddleware __call__"
       print "environ:",environ
       if environ['PATH_INFO'].startswith(self.prefix):
           print "prefixmiddleware:",environ['PATH_INFO']
           environ['PATH_INFO'] = environ['PATH_INFO'][len(self.prefix):]
           print "start_response:",start_response
           environ['SCRIPT_NAME'] = self.prefix
           return self.app(environ, start_response)
       else:
           start_response('404', [('Content-Type', 'text/plain')])
           return ["This url does not belong to the app.".encode()]

