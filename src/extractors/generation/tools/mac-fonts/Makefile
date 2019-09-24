MODULE_NAME = MacFonts
ARCH        = x86_64
ROOT_DIR    = $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
TARGET_DIR  = $(ROOT_DIR)/.build/release
OUTPUT_DIR  = $(ROOT_DIR)/bin
SRC_DIR     = $(ROOT_DIR)/src

SWIFT_FILES = $(wildcard $(SRC_DIR)/*.swift)

SWIFT_VERSION_CHECK := $(strip $(shell TOOLCHAINS=swift swift --version | grep -c 4.2))

all: clean build test

build:
	if [ $(SWIFT_VERSION_CHECK) != 1 ]; then echo Invalid Swift compiler version; exit 1; fi
	brew bundle
	mkdir -p $(OUTPUT_DIR)
	TOOLCHAINS=swift swift build --static-swift-stdlib -c release -Xswiftc -Osize
	cp $(TARGET_DIR)/$(MODULE_NAME) $(OUTPUT_DIR)/$(MODULE_NAME)
	upx $(OUTPUT_DIR)/$(MODULE_NAME)

clean:
	rm -rf $(OUTPUT_DIR)
	rm -rf $(TARGET_DIR)

test:
	$(OUTPUT_DIR)/$(MODULE_NAME) Helvetica
