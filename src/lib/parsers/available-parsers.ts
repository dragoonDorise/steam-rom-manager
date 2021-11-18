export const availableParsers = [
  'Glob',
  'Glob-regex',
  'Epic',
  'Steam',
  'GOG Galaxy'
]

export const availableParserInputs: {[parserType: string]: string[]} = {
  'Glob': ['glob'],
  'Glob-regex': ['glob-regex'],
  'Steam': [],
  'Epic': ['manifests', 'epicLauncherMode'],
  'GOG Galaxy': ['galaxyExeOverride','gogLauncherMode']
}

export const artworkOnlyParsers = ['Steam']
export const ROMParsers = ['Glob', 'Glob-regex']
export const platformParsers = ['Epic','GOG Galaxy']
