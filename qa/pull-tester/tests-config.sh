#!/bin/bash
# Copyright (c) 2013-2014  
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

BUILDDIR="/media/rookie/Work/ProjectFunex/funexcoin"
EXEEXT=""

# These will turn into comments if they were disabled when configuring.
ENABLE_WALLET=1
ENABLE_UTILS=1
ENABLE_BITCOIND=1

REAL_BITCOIND="$BUILDDIR/src/funexcoind${EXEEXT}"
REAL_BITCOINCLI="$BUILDDIR/src/funexcoin-cli${EXEEXT}"

