@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set MAVEN_CMD_LINE_ARGS=%*
if "%MAVEN_CMD_LINE_ARGS%"=="" set MAVEN_CMD_LINE_ARGS=

set ERROR_CODE=0

@REM Find JAVA_HOME
if not "%JAVA_HOME%"=="" goto valDir
for %%i in (java.exe) do set "JAVACMD=%%~$PATH:i"
goto checkJavaCmd

:valDir
if exist "%JAVA_HOME%\bin\java.exe" goto setJavaCmd
echo The JAVA_HOME environment variable is not defined correctly.
goto error

:setJavaCmd
set "JAVACMD=%JAVA_HOME%\bin\java.exe"

:checkJavaCmd
if exist "%JAVACMD%" goto runMaven
echo Error: JAVA_HOME not found.
goto error

:runMaven
set "MAVEN_PROJECTBASEDIR=%~dp0"
if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%"

set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties"

if exist "%WRAPPER_JAR%" goto runWrapper

echo Downloading Maven Wrapper...
java -classpath "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper" org.apache.maven.wrapper.MavenWrapperMain %MAVEN_CMD_LINE_ARGS%
goto end

:runWrapper
"%JAVACMD%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %MAVEN_CMD_LINE_ARGS%
goto end

:error
set ERROR_CODE=1

:end
cmd /c exit /b %ERROR_CODE%
