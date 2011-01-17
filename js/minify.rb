require 'jsmin'

File.open('jsclock-0.5.js', 'r') {|file| puts JSMin.minify(file) }
