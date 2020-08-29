
Debian
====================
This directory contains files used to package funexcoind/funexcoin-qt
for Debian-based Linux systems. If you compile funexcoind/funexcoin-qt yourself, there are some useful files here.

## funexcoin: URI support ##


funexcoin-qt.desktop  (Gnome / Open Desktop)
To install:

	sudo desktop-file-install funexcoin-qt.desktop
	sudo update-desktop-database

If you build yourself, you will either need to modify the paths in
the .desktop file or copy or symlink your funexcoinqt binary to `/usr/bin`
and the `../../share/pixmaps/funexcoin128.png` to `/usr/share/pixmaps`

funexcoin-qt.protocol (KDE)

