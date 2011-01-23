require 'jsmin'

File.open('jsclock-0.6.js', 'r') {|file| puts JSMin.minify(file) }
