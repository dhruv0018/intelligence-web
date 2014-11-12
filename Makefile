
qa: clean
	${MAKE} intelligence-web-client GRUNT_TARGET=new-qa

intelligence-web-client:
	git for-each-ref --format='%(refname:short)' refs/heads | while read branch; do \
		echo $$branch; \
		mkdir -p $$branch && \
		cd $$branch && \
		git checkout $$branch && \
	    git pull && \
        npm install && \
        grunt ${GRUNT_TARGET}; \
	done

clean:
	rm -f npm-debug.log

distclean: clean
	rm -rf build

