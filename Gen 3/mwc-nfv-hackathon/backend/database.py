#!/usr/bin/python

###############################################################################
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
 
################################################################################
import psycopg2
import sys
import pprint
import string
import random

from psycopg2.extensions import AsIs
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT 
from config import db_config, get_config_param
from passlib.hash import pbkdf2_sha256 as sha256
 
def db_check_credentials(username,password):
    """ Connect to the PostgreSQL database server """
    conn = None
    # read connection parameters
    params = db_config('database.ini','vnf_onboarding')
    db_table = get_config_param('database.ini','Details','table')
 
    # connect to the PostgreSQL server
    print('Connecting to the PostgreSQL database...')
    conn = psycopg2.connect(**params)	
 
 
    # conn.cursor will return a cursor object, you can use this cursor to perform queries
    cursor = conn.cursor()
 
    # execute our Query
    check_user_query = "SELECT username,password FROM {} WHERE ( {}.username = '{}' )".format(db_table,db_table,username)
   
    try:
 
        cursor.execute(check_user_query)
    except:
        print "db_check_credentials:Cannot execute",check_user_query 
 
    # retrieve the records from the database
    records = cursor.fetchall()
    print(records)
     
    for rec in records:
        print rec
        db_password = sha256.verify(password,rec[1])
        print "Verified password",db_password,rec[1]
        if rec[0] ==  username and db_password == True:
           print "db_check_credentials:User {} is Authenticated".format(username)
           return True
    print "Did not find user",username
    cursor.close()
    return False 

        

def db_user_signup(username,password,emailid):
    """ Connect to the PostgreSQL database server """
    conn = None
    # read connection parameters
    params = db_config()
    pprint.pprint(params)
    #pprint.pprint(params['users_database'])
    #dbname = params['users_database']

    # connect to the PostgreSQL server
    print('Connecting to the PostgreSQL database...')
    conn = psycopg2.connect(**params)
    #conn = psycopg2.connect(params['dbname'],params['user'],params['password'],params['host'])
  
    #Needed for Create DB op 
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    # conn.cursor will return a cursor object, you can use this cursor to perform queries
    cursor = conn.cursor()
    vnf_params = db_config('database.ini','vnf_onboarding')
    vnf_dbname = vnf_params['dbname']
    #cursor.execute("SELECT datname FROM pg_catalog.pg_database WHERE datname = 'vnf_onboarding_tool_db'")
    cursor.execute("SELECT datname FROM pg_catalog.pg_database WHERE datname = %(dname)s",{'dname':vnf_dbname})
    records = cursor.fetchall()
    if len(records) > 0:
        print "Database {} exists".format(vnf_dbname)
    else:
        print "Databasedoes NOT exist"
        try:
           cdb_query = "CREATE DATABASE %s OWNER %s"
           cdb_data= (AsIs(vnf_dbname),params['user'])
           cursor.execute(cdb_query,cdb_data)
           #cursor.execute("CREATE DATABASE %(dname)s OWNER %(user)s;",{'dname': AsIs(vnf_dbname),'user':params['user']})
        except psycopg2.DatabaseError, e:
           print 'Error %s' % e    
           sys.exit(1)
 
        #finally:   
          #if con:
          #  con.close()
    print "Database {} Created successfully".format(vnf_dbname)

    cursor.close()
    conn.close()
    db_connect_tool_database()
    usersignup_status = insert_data(username,password,emailid)
    return  usersignup_status


def db_connect_tool_database():
    vnf_params = db_config('database.ini','vnf_onboarding') 
    print('Connecting to the PostgreSQL database...')
    conn = psycopg2.connect(**vnf_params)

    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    # conn.cursor will return a cursor object, you can use this cursor to perform queries
    cursor = conn.cursor()
    table_name=get_config_param('database.ini','Details','table')
    table_exist_query = "SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_catalog= %s AND  table_schema='public' AND  table_name=%s);"
    table_exist_data = (vnf_params['dbname'],table_name)
    cursor.execute(table_exist_query,table_exist_data)
    records = cursor.fetchall()
    pprint.pprint((records[0])[0])
    isTable = (records[0])[0]
    print(isTable)
    if len(records) > 0 and isTable == True:
      print "Database table {} exists".format(table_name)
     
    else:
       print "Database table {} does NOT exist".format(table_name)
       try:		
          create_table = "CREATE TABLE {} (username varchar(18) UNIQUE not null,  password text not null , emailid varchar(50) UNIQUE  not null)".format(table_name)
          #table_data = (AsIs(table_name))
          print("Creating Table %s",table_name)
          print("Query %s",create_table)
          cursor.execute(create_table)
          print("Table Created")
       except psycopg2.DatabaseError, e:
           print 'Error %s' % e    
           sys.exit(1)

    cursor.close()
    conn.close()
    
    

def insert_data(username,password,emailid):
    vnf_params = db_config('database.ini','vnf_onboarding')
    print('Connecting to the PostgreSQL database...')
    conn = psycopg2.connect(**vnf_params)

    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    # conn.cursor will return a cursor object, you can use this cursor to perform queries
    cursor = conn.cursor()
    table_name=get_config_param('database.ini','Details','table')
    hashedpassword = sha256.hash(password)
    try:
      #insertop = "INSERT INTO {} (username, password, emailid ) VALUES({},{},{})".format(table_name,username,password,emailid)
      insertop = "INSERT INTO %s (username, password, emailid ) VALUES(%s,%s,%s)"
      insertData = (AsIs(table_name),username,hashedpassword,emailid)
      print("insert query = %s",insertop)
      cursor.execute(insertop,insertData)
    except psycopg2.DatabaseError, e:
      print 'Error %s' % e
      #sys.exit(1)
      return "False"
    cursor.close()
    conn.close()
    return "True"



def db_generate_newpassword(credentials):
    print "db_generate_newpassword:Received",credentials 
    if 'username' in credentials.keys():
      print "db_generate_newpassword: Received Username"
      if check_if_userexists(credentials) == True:
         print "db_generate_newpassword: generate new passwd for user {}".format(credentials['username'])
         generate_and_updatepassword(credentials)
         return int(0)
      else:
         return int(1)
    elif 'emailaddress'in credentials.keys():
       print "db_generate_newpassword: Received emailaddress {}".format(credentials['emailaddress'])
       if check_if_userexists(credentials) == True:
          print "db_generate_newpassword: generate new passwd for user with mailid {}".format(credentials['emailaddress'])
          generate_and_updatepassword(credentials)
          return int(0)
       else:
          return int(1)

#def check_if_userexists(credentials):
#    username = ""
#    if(credentials['username']):
#      username = credentials['username']
#    else:
#      return False
#    conn = db_connect()
#    cursor = conn.cursor()
#    cursor.execute("SELECT username,emailid FROM vnf_onboarding_tool_users WHERE ( vnf_onboarding_tool_users.username = username )")
#
#    # retrieve the records from the database
#    records = cursor.fetchall()
#    print(records)
#    userExists = False
#    if len(records) > 0:
#       for rec in records:
#          print "check_if_userexists:rec",rec
#          print "check if user exists: rec[0],rec[1]",rec[0],rec[1]
#          if rec[0] ==  username: 
#             print "check_if_userexistes:user match found",rec[0]
#             print "check_if_userexists:mailid of matched user", rec[1]
#             credentials['emailaddress'] = rec[1]
#             print "check_if_userexists:user {} exists".format(username)
#             userExists = True
#             break
#    cursor.close()
#    conn.close()
#    return userExists
#
#def generate_and_updatepassword(credentials):
#    randompassword = password_gen()
#    print "generate_and_updatepassword",randompassword
#    if credentials['username']:
#       db_table = get_config_param('database.ini','Details','table')
#       conn = db_connect()
#       conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
#       cursor = conn.cursor()
#       print "generate_and_updatepassword:Forming Query"
#       #update_query = "UPDATE %s SET password = %s WHERE (%s'.username' = %s)"
#       update_query = "UPDATE {} SET password = '{}'  WHERE ({}.username = '{}')".format(db_table,randompassword,db_table,credentials['username'])
#       #update_query_data = (AsIs(db_table),randompassword,db_table,credentials['username'])
#       #cursor.execute("UPDATE vnf_onboarding_tool_users SET password = randompassword WHERE (vnf_onboarding_tool_users.username = username)")
#       #cursor.execute(update_query,update_query_data)
#       print update_query
#       cursor.execute(update_query)
#       cursor.close()
#       conn.close()
#       credentials['password'] = randompassword
#       return True

def check_if_userexists(credentials):
    username = ""
    emailid = ""
    userExists = False
    db_table = get_config_param('database.ini','Details','table')
    conn = db_connect()
    cursor = conn.cursor()
    check_user_query = ""
    if 'username' in credentials.keys():
      username = credentials['username']
      check_user_query = "SELECT username,emailid FROM {} WHERE ( {}.username = '{}' )".format(db_table,db_table,username)
    elif 'emailaddress' in credentials.keys():
      emailid = credentials['emailaddress']
      check_user_query = "SELECT username,emailid FROM {} WHERE ( {}.emailid = '{}')".format(db_table,db_table,emailid)
      
    try: 
       cursor.execute(check_user_query)
    except:
       print "check_if_userexists: cannot execute find username or emailid query"

    # retrieve the records from the database
    records = cursor.fetchall()
    print(records)
    
    if len(records) > 0:
       for rec in records:
          print "check_if_userexists:rec",rec
          print "check if user exists: rec[0],rec[1]",rec[0],rec[1]
          if username and rec[0] ==  username:
             print "check_if_userexistes:user match found",rec[0]
             print "check_if_userexists:mailid of matched user", rec[1]
             credentials['emailaddress'] = rec[1]
             print "check_if_userexists:user {} exists".format(username)
             userExists = True
             break
	  elif emailid and rec[1] == emailid:
             print "check_if_userexistes:emailid found",rec[1]
             print "check_if_userexists:user with a mailid {} is {}".format(emailid, rec[0])
             credentials['username'] = rec[0]			 
	     userExists = True
			 
    cursor.close()
    conn.close()
    return userExists

def generate_and_updatepassword(credentials):
    update_query = ""
    randompassword = password_gen()
    hashedpassword = sha256.hash(randompassword)
    print "generate_and_updatepassword",randompassword
    db_table = get_config_param('database.ini','Details','table')
    conn = db_connect()
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    if 'username' in credentials.keys():
       print "generate_and_updatepassword:Forming Query"
       update_query = "UPDATE {} SET password = '{}'  WHERE ({}.username = '{}')".format(db_table,hashedpassword,db_table,credentials['username'])
       print update_query
    elif 'emailaddress' in credentials.keys():
       print "generate_and_updatepassword:Forming Query"
       update_query = "UPDATE {} SET password = '{}'  WHERE ({}.emailid = '{}')".format(db_table,hashedpassword,db_table,credentials['emailaddress'])
       print update_query
   
    try: 
        cursor.execute(update_query)
    except:
        print "generate_and_updatepassword: Cannont execute update password query command"

    cursor.close()
    conn.close()
    credentials['password'] = randompassword
    return True




def db_connect():
    vnf_params = db_config('database.ini','vnf_onboarding')
    print('Connecting to the PostgreSQL database...')
    conn = psycopg2.connect(**vnf_params)
    return conn

def password_gen():
    # Alphanumeric + special characters
    #chars = string.letters + string.digits + string.punctuation
    chars = string.letters + string.digits 
    pwdSize = 8
    p =  ''.join((random.choice(chars)) for x in range(pwdSize))
    print p
    return p

if __name__ == '__main__':
    #db_check_credentials("admin","admin") 
    #db_user_signup('admin','admin', 'admin@vmware.com')
    credentials = {"username":"kishor"}
    credentials_email = {"emailaddress":"nandakishor.joshi@capgemini.com"}
   
    #db_generate_newpassword({"username":"kishor"})
    #db_generate_newpassword(credentials)
    db_generate_newpassword(credentials_email)
