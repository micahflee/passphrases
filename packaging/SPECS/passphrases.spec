Name:		passphrases
Version:	{{version}}
Release:	1%{?dist}
Summary:	Passphrases is a tool that helps you generate high-entropy passphrases and memorize them using spaced repition.

Group:		Applications/Productivity
License:	MIT
URL:		https://github.com/micahflee/passphrases
Source0:	%{name}-%{version}.tar.gz

BuildRequires:	nodejs
Requires:	      nodejs

%description
Passphrases is a tool that helps you generate high-entropy passphrases and memorize them using spaced repition.

%files
/opt/Passphrases/Passphrases
/opt/Passphrases/libffmpegsumo.so
/opt/Passphrases/nw.pak
/opt/Passphrases/icudtl.dat
/usr/bin/passphrases
/usr/share/pixmaps/passphrases.png
/usr/share/applications/passphrases.desktop

%changelog
* Sun Mar 15 2015 Micah Lee <micah@micahflee.com> 0.1.0
- First build
