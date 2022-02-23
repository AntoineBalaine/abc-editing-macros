
enum harmonisationStyles { 
    soli = "soli",
    drp2 = "drp2",
    drp3 = "drp3",
    drp4 = "drp24",
    spread = "sprd",
    cluster = "clstr"
}

enum instrumentFamily { 
    brass = "br",
    woodwinds = "wd",
    percussion = "prc",
    keys = "pn",
    strings = "str",
    pluckStrings = "plk",
}

/*
    if a tag is a harmony enum, 
        copy the contents to the harmony file
        filenaming convention: songTitle.harmony.abc
    if a tag is an instrumentFamily type, 
        copy the contents to instrumentFamilies file || copy the instrument tags to the harmony file
test: expect(fs.existsSync('file.txt')).to.be.true
*/