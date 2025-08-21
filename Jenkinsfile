pipeline{
    agent any
    environment{
        SONAR_HOME= tool "sonar"
    }
    stages{
        stage("Clone Code From github"){
            steps{
                git url: "https://github.com/prashant-siddhpura/ExpenseTracker.git", branch: "main"
                
                echo "Cloning is done"
            }
            
        }
        stage("Sonarqube quality analysis"){
            steps{
                withSonarQubeEnv("sonar"){
                    sh "$SONAR_HOME/bin/sonar-scanner -Dsonar.projectName=expense-tracker -Dsonar.projectKey=expense-tracker"
                }
                
            }
        }
        stage("OWASP Dependency Check"){
            steps{
                 dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'owasp'
                 dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        stage("Sonar quality Gate Scan"){
            steps{
                timeout(time: 2, unit: "MINUTES"){
                    waitForQualityGate abortPipeline: false
                }
            }
        }
        stage("Trivy File System Scan"){
            steps{
                 sh "trivy fs --format table -o trivy-fs-report.html ."
            }
        }
         stage("Deploy"){
            steps{
                 sh "docker compose up -d"
            }
        }
    }
}
