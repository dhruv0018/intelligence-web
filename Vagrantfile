# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrant file for the Intelligence Web Client
# HTTP port: 8000
# HTTPS port: 8001

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # All Vagrant configuration is done here. The most common configuration
  # options are documented and commented below. For a complete reference,
  # please see the online documentation at vagrantup.com.

  # vid is the vagrant identifier. letters, numbers, and hyphens only.
  # In other parts this will be converted to underscores where needed.
  vid = 'intelligence-web-client'
  vidu = vid.gsub('-', '_')

  config.vm.hostname = vid + "-dev"

  config.vm.define vidu + "_dev" do |vmc|

    # Every Vagrant virtual environment requires a box to build off of.
    vmc.vm.box = "precise64"

    # The url from where the 'config.vm.box' box will be fetched if it
    # doesn't already exist on the user's system.
    vmc.vm.box_url = "http://files.vagrantup.com/precise64.box"

  end

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network :forwarded_port, guest: 8000, host: 8000
  config.vm.network :forwarded_port, guest: 8001, host: 8001

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  config.vm.provider :virtualbox do |vbox|

    # Use VBoxManage to customize the VM. For example to change memory:
    vbox.customize ["modifyvm", :id, "--memory", "256"]
    vbox.customize ["modifyvm", :id, "--rtcuseutc", "on"]
    vbox.customize ["modifyvm", :id, "--name", vidu + "_vagrant"]

  end

  config.vm.provision :shell, inline: $script

end

$script = <<SCRIPT

# Update package list
sudo apt-get update -y

# Install git
sudo apt-get install -y git

# Install Node.js dependencies
sudo apt-get install -y python-software-properties python g++ make

# Add (Un)Official Node.js PPA
sudo apt-add-repository ppa:chris-lea/node.js
sudo apt-get update -y

# Install Node.js
sudo apt-get install -y nodejs

# Install Grunt.js
sudo npm install --silent -g grunt-cli

# Sync the local repo with a copy in the VM
rsync --archive --delete --filter=':- .gitignore' /vagrant/ /home/vagrant

# Install dependencies
npm install --silent

# Run Grunt
grunt

SCRIPT

