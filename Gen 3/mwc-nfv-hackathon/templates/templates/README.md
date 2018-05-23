{% if orch_type == 'Cloudify 4.0' %}

VNF onboarding with Cloudify
============================

Zip structure:
/types - needed types for Standard TOSCA blueprints
/scripts - scripts used in configuration
{{ env_type }}-inputs.yaml - inputs needed for Cloudify blueprint deployment, should be copied and filled outside the zip file 
{{ vnf_name }}-{{ env_type }}.yaml - Cloudify blueprint
{{ vnf_name }}-{{ env_type }}-TOSCA.yaml - Standard TOSCA blueprint
{{ vnf_name }}-{{ env_type }}-OSM.yaml - Standard TOSCA blueprint


Run your VNF with Cloudify and follow steps below.

1. Setup Cloudify virtualenv.
   
    You can skip this step if your virtualenv is already created and just activate it or use Cloudify UI instead.
    
    Using virtualenv:
    `virtualenv cloudify`
    `source cloudify/bin/activate`
    
    or using virtualenv wrapper:
    `mkvirtualenv cloudify`
    
    install cloudify cli:
    `pip install cloudify==3.4.1`
    
    Use cloudify manager:
    `cfy use -t <cfy manager ip>`

2. Install
    Fill inputs template with relevant data: {{ env_type }}-inputs.yaml
    
    At once:
    `cfy install -l {{ vnf_name }}-{{ env_type }}.zip  -n {{ vnf_name }}-{{ env_type }}.yaml -b {{ vnf_name }} --include-logs -i {{ env_type }}-inputs.yaml`
    
    or step by step:
    `cfy blueprints publish-archive -l {{ vnf_name }}-{{ env_type }}.zip  -n {{ vnf_name }}-{{ env_type }}.yaml -b {{ vnf_name }}-{{ env_type }}`
    `cfy deployments create -d {{ vnf_name }}-{{ env_type }} -b {{ vnf_name }}-{{ env_type }}`
    `cfy executions -w install -d {{ vnf_name }}-{{ env_type }} --include-logs`

3. How to operate:

    Using UI or CLI. <information>
   
4. Uninstall 

    At once:
    `cfy uninstall -d {{ vnf_name }}-{{ env_type }} --include-logs`
    
    or step by step:
    `cfy executions -w uninstall -d {{ vnf_name }}-{{ env_type }}`
    `cfy deployments delete -d {{ vnf_name }}-{{ env_type }}`
    `cfy blueprints delete -b {{ vnf_name }}-{{ env_type }}`

{% elif orch_type == "TOSCA 1.1" %}

Standard TOSCA blueprint
------------------------

1. Setup environment
   `virtualenv env`
   `. env/bin/activate`
   `pip install git+http://git-wip-us.apache.org/repos/asf/incubator-ariatosca.git`

2. Unzip blueprints package
   `unzip {{ vnf_name }}-{{ env_type }}`

3. Parse blueprint to generate model
   `aria parse {{ vnf_name }}-{{ env_type }}/{{ vnf_name }}-{{ env_type }}-TOSCA.yaml instance`


{% elif orch_type == "RIFT.ware 5.3" %}

VNF Onboarding with RIFT.io
===========================

Objects that are created in the directory structure:

1. This 'README.md' file

2. Archive of the VNF descriptor {{vnf_type}}-{{env_type}}-{{ vnfd_name }}_vnfd.tar.gz for onboarding to the resource orchestrator. Untar-ing this gives:
   a. Folder {{vnf_type}}-{{env_type}}-{{ vnfd_name }}_vnfd that contains all files required for the VNF package.
   b. Virtual Network Function Descriptor (VNFD) for the VNF in YAML format.

3. Archive of the NS descriptor {{vnf_type}}-{{env_type}}-{{ vnfd_name }}_nsd.tar.gz for onboarding to the resource orchestrator. Untar-ing this gives:
   a. Folder {{vnf_type}}-{{env_type}}-{{ vnfd_name }}_nsd that contains all files required for the NS package
   b. Network Service Descriptor (NSD) for the VNF in YAML format.


Copy the gzipped packages to a location that is accessible by a browser for RIFT.ware onboarding, such as to your laptop or desktop system.

Browse to the RIFT.ware UI to sign in to the Launchpad and proceed with onboarding. Checkout https://open.riftio.com/documentation/ for more information.

{% else %}
# VNF-Onboarding
{% endif %}
