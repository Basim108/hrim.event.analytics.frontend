import {LogService} from "./log.service";

describe('LogService', () => {
  let logger: LogService

  beforeEach(() => {
    logger = new LogService()
    spyOn(logger, 'debug')
    spyOn(console, 'log')
    spyOn(console, 'info')
    spyOn(console, 'debug')
    spyOn(console, 'warn')
    spyOn(console, 'error')
  })

  it('logConstructor should log with debug level', () => {
    logger.logConstructor({})
    expect(logger.debug).toHaveBeenCalledTimes(1)
  })

  it('logConstructor should log with debug level', () => {
    logger.logConstructor({})
    expect(logger.debug).toHaveBeenCalledTimes(1)
  })

  it('log should log with info level', () => {
    logger.log('it is test of log')
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.debug).toHaveBeenCalledTimes(0)
    expect(console.info).toHaveBeenCalledTimes(0)
    expect(console.warn).toHaveBeenCalledTimes(0)
    expect(console.error).toHaveBeenCalledTimes(0)
  })

  it('info should log with info level', () => {
    logger.info('it is test of info')
    expect(console.log).toHaveBeenCalledTimes(0)
    expect(console.debug).toHaveBeenCalledTimes(0)
    expect(console.info).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledTimes(0)
    expect(console.error).toHaveBeenCalledTimes(0)
  })

  it('debug should not log in production mode', () => {
    logger.debug('it is test of debug')
    expect(console.log).toHaveBeenCalledTimes(0)
    expect(console.debug).toHaveBeenCalledTimes(0)
    expect(console.info).toHaveBeenCalledTimes(0)
    expect(console.warn).toHaveBeenCalledTimes(0)
    expect(console.error).toHaveBeenCalledTimes(0)
  })

  it('warn should log with warn level', () => {
    logger.warn('it is test of warn')
    expect(console.log).toHaveBeenCalledTimes(0)
    expect(console.debug).toHaveBeenCalledTimes(0)
    expect(console.info).toHaveBeenCalledTimes(0)
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledTimes(0)
  })

  it('error should log with error level', () => {
    logger.error('it is test of error')
    expect(console.log).toHaveBeenCalledTimes(0)
    expect(console.debug).toHaveBeenCalledTimes(0)
    expect(console.info).toHaveBeenCalledTimes(0)
    expect(console.warn).toHaveBeenCalledTimes(0)
    expect(console.error).toHaveBeenCalledTimes(1)
  })
})
