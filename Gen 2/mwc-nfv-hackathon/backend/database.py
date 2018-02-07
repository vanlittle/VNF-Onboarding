#!/usr/bin/python
import psycopg2
import sys
import pprint

from config import db_config
 
def db_check_credentials(username,password):
    """ Connect to the PostgreSQL database server """
    conn = None
    # read connection parameters
    params = db_config()
 
    # connect to the PostgreSQL server
    print('Connecting to the PostgreSQL database...')
    conn = psycopg2.connect(**params)	
 
 
    # conn.cursor will return a cursor object, you can use this cursor to perform queries
    cursor = conn.cursor()
 
    # execute our Query
    #cursor.execute("SELECT username,password FROM account WHERE ( account.username = username and account.password = password)")
    cursor.execute("SELECT username,password FROM account") 
 
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
        


if __name__ == '__main__':
    db_check_credentials("admin","admin") 
