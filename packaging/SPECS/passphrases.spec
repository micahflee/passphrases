Name:		passphrases
Version:	{{version}}
Release:	1%{?dist}
Summary:	Passphrases is a tool that helps you generate high-entropy passphrases and memorize them using spaced repition.

Group:		Applications/Productivity
License:	MIT
URL:		https://github.com/micahflee/passphrases
Source0:	%{name}-%{version}.tar.gz

#BuildRequires:	nodejs
#Requires:	      nodejs

BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-root


%description
Passphrases is a tool that helps you generate high-entropy passphrases and memorize them using spaced repition.


%prep
%setup -q


%build
# empty


%install
rm -rf %{buildroot}
mkdir -p  %{buildroot}

# in builddir
cp -a * %{buildroot}


%clean
rm -rf %{buildroot}


%files
%defattr(-,root,root,-)
/opt/Passphrases/Passphrases
/opt/Passphrases/icudtl.dat
/opt/Passphrases/libffmpegsumo.so
/opt/Passphrases/nw.pak
/usr/bin/passphrases
/usr/share/applications/passphrases.desktop
/usr/share/pixmaps/passphrases.png


%changelog
* Sun Mar 15 2015 Micah Lee <micah@micahflee.com> 0.1.0
- First build

