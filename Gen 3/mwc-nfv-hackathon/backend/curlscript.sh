
for ((i=1;i<=100;i++)); 
   do   
     #curl -v --header "Connection: keep-alive" "localhost:8080/user?uuid=52010&model_id=20&attr=0"; 
      `curl -X POST http://localhost:5000/generate --header "Content-Type: application/json" -d '{"Kishor": "blueprints", "params": {"env_type": "OpenStack", "disk_size": "", "nic2_name": "nic2", "image_id": "993b6748-f50f-40c6-86ba-071906865d52", "memory": "", "nic1_name": "nic1", "nic3_name": "nic3", "nic4_name": "nic4", "flavor_id": "8e6069a3-d8c6-4741-8e0d-6373b2ca38cc","scripts": {"create": "http://localhost:5555/create.sh"}, "vnf_name": "Fortigate", "vnf_description": "Fortigate description", "cpu": ""}}'`
  done
