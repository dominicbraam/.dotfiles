#!/bin/bash

DBUS_DIR="$HOME/.dotfiles/custom_config/dbus"

mkdir -p $DBUS_DIR
env | grep DBUS_SESSION_BUS_ADDRESS > $DBUS_DIR/Xdbus
echo 'export DBUS_SESSION_BUS_ADDRESS' >> $DBUS_DIR/Xdbus
env | grep DISPLAY >> $DBUS_DIR/Xdbus
echo 'export DISPLAY' >> $DBUS_DIR/Xdbus
env | grep XAUTHORITY >> $DBUS_DIR/Xdbus
echo 'export XAUTHORITY' >> $DBUS_DIR/Xdbus
chmod 600 $DBUS_DIR/Xdbus
exit 0
