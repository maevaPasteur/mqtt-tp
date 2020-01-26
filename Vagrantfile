# -*- mode: ruby -*-
# vi: set ft=ruby :
require 'yaml'

unless Vagrant.has_plugin?("vagrant-docker-compose")
  system("vagrant plugin install vagrant-docker-compose")
  puts "Dependencies installed, please try the command again."
  exit
end

compose = YAML.load_file('docker-compose.yml')

Vagrant.configure("2") do |config|
  config.vm.box = "debian/contrib-buster64"
  compose['services'].each do |k,v|
    if v['ports']
      v['ports'].each do |port|
        config.vm.network(:forwarded_port, guest: port, host: port)
      end
    end
  end
  config.vm.provision :shell, inline: "apt-get update"
  config.vm.provision :docker
  config.vm.provision :docker_compose, yml: "/vagrant/docker-compose.yml", rebuild: true, run: "always"
end
