require 'jsmin'

File.open('jsclock-0.4.js', 'r') {|file| puts JSMin.minify(file) }
