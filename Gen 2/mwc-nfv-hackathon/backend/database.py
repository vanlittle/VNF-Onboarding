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

from psycopg2.extensions import AsIs
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT 
from config import db_config, get_config_param
 
def db_check_credentials(username,password):
    """ Connect to the PostgreSQL database server """
    conn = None
    # read connection parameters
    params = db_config('database.ini','vnf_onboarding')
 
    # connect to the PostgreSQL server
    print('Connecting to the PostgreSQL database...')
    conn = psycopg2.connect(**params)	
 
 
    # conn.cursor will return a cursor object, you can use this cursor to perform queries
    cursor = conn.cursor()
 
    # execute our Query
    #cursor.execute("SELECT username,password FROM account WHERE ( account.username = username and account.password = password)")
    cursor.execute("SELECT username,password FROM vnf_onboarding_tool_users") 
 
    # retrieve the records from the database
    records = cursor.fetchall()
    print(records)
     
    for rec in records:
        print rec
        if rec[0] ==  username and rec[1] == password:
           print("found record")
           return True
    print("Did not find record")
    cursor.close()
    return False 

    # print out the records using pretty print
    # note that the NAMES of the columns are not shown, instead just indexes.
    # for most people this isn't very useful so we'll show you how to return
    # columns as a dictionary (hash) in the next example.
    #pprint.pprint(records)
        

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
        pprint.pprint("Database %s Created successfully",vnf_dbname)

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
          create_table = "CREATE TABLE {} (username varchar(18) UNIQUE not null,  password varchar(18) not null , emailid varchar(50) UNIQUE  not null)".format(table_name)
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
    try:
      #insertop = "INSERT INTO {} (username, password, emailid ) VALUES({},{},{})".format(table_name,username,password,emailid)
      insertop = "INSERT INTO %s (username, password, emailid ) VALUES(%s,%s,%s)"
      insertData = (AsIs(table_name),username,password,emailid)
      print("insert query = %s",insertop)
      cursor.execute(insertop,insertData)
    except psycopg2.DatabaseError, e:
      print 'Error %s' % e
      #sys.exit(1)
      return "False"
    cursor.close()
    conn.close()
    return "True"

if __name__ == '__main__':
    #db_check_credentials("admin","admin") 
    db_user_signup('admin','admin', 'admin@vmware.com')
