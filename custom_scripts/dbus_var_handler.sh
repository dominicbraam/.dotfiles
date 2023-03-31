#!/bin/bash

mkdir -p $HOME/.dbus
env | grep DBUS_SESSION_BUS_ADDRESS > $HOME/.dbus/Xdbus
echo 'export DBUS_SESSION_BUS_ADDRESS' >> $HOME/.dbus/Xdbus
env | grep DISPLAY >> $HOME/.dbus/Xdbus
echo 'export DISPLAY' >> $HOME/.dbus/Xdbus
env | grep XAUTHORITY >> $HOME/.dbus/Xdbus
echo 'export XAUTHORITY' >> $HOME/.dbus/Xdbus
chmod 600 $HOME/.dbus/Xdbus
exit 0
