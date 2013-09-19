# jQuery Print Preview plugin
## 9-18-13 Updates
- Updated correct for $.browser being deprecated in jQuery 1.9 (side-effect: removed support for IE 7 & below)
- Updated demo file to use jQuery 1.10.2 & removed carousel which was dependent on the jquerytools library that was previously being used. 

The jQuery Print Preview plugin is designed to provide visitors with a preview of the print version of a web site.
Unlike traditional print previews this plugin brings in all content and print styles within a modal window.

[Check out the demo](http://briceshatzer.github.com/jquery-print-preview-plugin/example/index.html)

## Usage
Prerequisites:

- [jQuery](http://jquery.com/)
- A print stylesheeet with a media="print" attribute

Using the plugin:

1. Pour in plugin CSS
2. Add a print preview link and initalise the plugin like so

    ``$('#foo').prepend('Print this page');
    $('a.print-preview').printPreview();``

## Supported Browsers
- Internet Explorer 8, 9, and 10
- Safari
- Google Chrome
- Firefox

## Authors
Developed by Tim Connell.
Released in conjunction with [Sitepoint/Design Festival](http://designfestival.com/when-visitors-print-about-that-print-stylesheet/).

## Licence
Copyright 2011, Tim Connell
Licensed under the GPL Version 2 license
http://www.gnu.org/licenses/gpl-2.0.html

## Download
[Grab the tarball](http://github.com/etimbo/jquery-print-preview-plugin/tarball/master) containing source files and demo.

