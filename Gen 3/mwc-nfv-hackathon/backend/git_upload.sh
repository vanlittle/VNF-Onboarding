#!/bin/sh

# Input Section
USER_NAME='amolbjadhav'
PASSWORD='ca$hc0w'
# URL of the repository
URL=https://github.com/amolbjadhav/VNF-Blueprint-Library.git
# URL with user name and password to push the blueprints in repository
PUSH_URL=https://$USER_NAME:$PASSWORD@github.com/amolbjadhav/VNF-Blueprint-Library.git
main_folder="ABCC"
git_repository="VNF-Blueprint-Library"

# Main code starts here
if [ "$5" = "vCloud Director" ]
then
    blueprint_folder="vCloudDirector" 
elif [ "$5" = "OpenStack" ]
then
    blueprint_folder="OpenStack" 
else
   echo error with $5 
fi
# The blueprint folder will be created with user name and time stamp 
#TIME_STAMP=$(date +%Y%m%dT%H%M%S)
TIME_STAMP=$(date +%T)
foldername=$USER_NAME'_'$(date +%T)
# The commit comment explains which blueprint you are creating 
comment=$3'_'$TIME_STAMP
echo My directory name is:$foldername
echo My commit comment is:$3
echo My orch is:$4
FILE_NAME=$1
echo $FILE_NAME
fname=`basename $FILE_NAME`
echo ****************$fname
echo ****************My six parameter is$6
INPUT=$FILE_NAME
input1=$(echo $INPUT| cut -d'/' -f 4)
echo $input1
SUBSTRING=$(echo $input1| cut -d'.' -f 1)
echo *****************My substring is $SUBSTRING

mkdir $main_folder 
cd $main_folder 
git init
# make the git repository baseline by resetting it
#git reset --hard HEAD
# Place the URL which you want to clone and place blueprint in it 
git clone $URL 
cd  VNF-Blueprint-Library
git pull $URL
if [ "$4" = "TOSCA 1.1" ]
then
   echo I am in TOSCA
   mkdir $blueprint_folder 
   mkdir $blueprint_folder/TOSCA
   cd $blueprint_folder/TOSCA 
elif [ "$4" = "OSM 3.0" ]
then
   echo I am in OSM 
   mkdir $blueprint_folder 
   mkdir $blueprint_folder/OSM
   cd $blueprint_folder/OSM
elif [ "$4" = "Cloudify 3.4" ]
then
   echo I am in Cloudify 
   mkdir $blueprint_folder 
   mkdir $blueprint_folder/Cloudify
   cd $blueprint_folder/Cloudify 
else
  echo Error with $4
fi

cp "$FILE_NAME" . 
echo Unzipping the file 
unzip "*.zip"
if echo "$fname" | grep -q "vCloud"; then
  echo "matched";
else
  echo "no match";
fi

if [ "$fname" = "$6-vCloud" ]
then 
   mv $fname\ Director $fname\ Director.$TIME_STAMP

elif [ "$SUBSTRING" = "$6-Openstack" ]
then 
  echo $SUBSTRING.$TIME_STAMP   
  mv $SUBSTRING $SUBSTRING.$TIME_STAMP
else
   mv $SUBSTRING $SUBSTRING.$TIME_STAMP
fi
echo Removing zip file 
rm *.zip
echo My file is: $FILE_NAME
git add .
commit_comment="Adding blueprint package for "$comment 
echo commit comment is:$commit_comment
git commit -m "$commit_comment"  
#git push https://$USER_NAME:$PASSWORD@github.com/vanlittle/VNF-Onboarding.git
git push $PUSH_URL
