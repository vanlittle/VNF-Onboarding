#!/bin/bash
ctx logger info ${HOST_IP}
ssh -o StrictHostKeyChecking=no admin@${HOST_IP} -T << EOF
 config system interface
 edit port1
 set mode dhcp
 set allowaccess http https ssh ping
 next
 edit port2
 set mode dhcp
 set allowaccess http https ssh ping
 next
 edit port3
 set mode dhcp
 set allowaccess http https ssh ping
 end
EOF
