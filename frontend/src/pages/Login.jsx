import { api } from '../utils/api';
import { Logo } from '../assets/logo';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  PageContainer
} from '../components/common';

export default function Login() {
  const handleGitHubLogin = () => {
    window.location.href = api.getGithubAuthUrl();
  };

  return (
    <PageContainer>
      <div className="w-full max-w-md space-y-6 px-4 mx-auto">
        <div className="flex flex-col items-center">
          <h2 className="text-center text-3xl font-bold text-facebook-blue">
            AutoPull
          </h2>
          <p className="mt-2 text-center text-sm">
            Automate GitHub issue fixes with AI coding agents
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Connect your GitHub account to find and implement low-hanging fruit issues in repositories using AI coding agents.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-2.5">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full" style={{ backgroundColor: 'var(--facebook-blue-100)', color: 'var(--facebook-blue-600)' }}>
                  <span className="text-xs font-medium">1</span>
                </div>
                <div className="ml-3 text-sm">Connect your GitHub account</div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full" style={{ backgroundColor: 'var(--facebook-blue-100)', color: 'var(--facebook-blue-600)' }}>
                  <span className="text-xs font-medium">2</span>
                </div>
                <div className="ml-3 text-sm">Select a repository to scan</div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full" style={{ backgroundColor: 'var(--facebook-blue-100)', color: 'var(--facebook-blue-600)' }}>
                  <span className="text-xs font-medium">3</span>
                </div>
                <div className="ml-3 text-sm">Watch AI implement the solution</div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              variant="primary" 
              className="w-full" 
              onClick={handleGitHubLogin}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Connect with GitHub
            </Button>
          </CardFooter>
        </Card>
        
        <p className="mt-4 text-center text-xs" style={{ color: 'var(--neutral-500)' }}>
          By connecting, you agree to our{' '}
          <a href="#" style={{ color: 'var(--facebook-blue-600)', fontWeight: 500 }}>
            Terms of Service
          </a>
        </p>
      </div>
    </PageContainer>
  );
}
