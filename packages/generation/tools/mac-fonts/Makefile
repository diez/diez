MODULE_NAME = MacFonts
ARCH        = x86_64
ROOT_DIR    = $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
OUTPUT_DIR  = $(ROOT_DIR)/bin
SRC_DIR     = $(ROOT_DIR)/src

SWIFT_FILES = $(wildcard $(SRC_DIR)/*.swift)

build:
	mkdir -p $(OUTPUT_DIR)
	swiftc $(SWIFT_FILES) -o $(OUTPUT_DIR)/$(MODULE_NAME)

clean:
	rm -r $(OUTPUT_DIR)

test:
	make
	$(OUTPUT_DIR)/$(MODULE_NAME) Helvetica
