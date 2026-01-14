"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy } from "lucide-react"
import Link from "next/link"

export default function FirstAdminSetupPage() {
  const [email, setEmail] = useState("admin@example.com")
  const [userIdToCopy, setUserIdToCopy] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [sqlCommand, setSqlCommand] = useState("")
  const supabase = createClient()

  const handleFindUser = async () => {
    // This would only work with service role key, which we can't use from client
    // Instead, show instructions for manual setup
    setSqlCommand(`
-- After your admin account is created, run this in Supabase SQL Editor:
INSERT INTO public.admin_users (id)
SELECT id FROM auth.users WHERE email = '${email}'
ON CONFLICT (id) DO NOTHING;

-- Or if you know the user ID:
INSERT INTO public.admin_users (id) 
VALUES ('your-user-id-here')
ON CONFLICT (id) DO NOTHING;
    `)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">First Admin Setup</h1>
          <p className="text-muted-foreground">Follow these steps to create your first admin account</p>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  1
                </div>
                <CardTitle>Create Admin Account</CardTitle>
              </div>
              <CardDescription>Sign up with your admin email address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Go to <code className="bg-muted px-2 py-1 rounded">/auth/sign-up</code> and create an account with:
              </p>
              <div className="bg-muted p-4 rounded space-y-2 font-mono text-sm">
                <p>Email: admin@example.com (or your preferred email)</p>
                <p>Password: (choose a strong password)</p>
              </div>
              <p className="text-sm text-muted-foreground">Confirm your email address when prompted.</p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  2
                </div>
                <CardTitle>Grant Admin Privileges</CardTitle>
              </div>
              <CardDescription>Add the user to the admin_users table</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm mb-4">
                Open your <strong>Supabase Dashboard</strong> and go to <strong>SQL Editor</strong>. Run this command:
              </p>
              <div className="bg-muted p-4 rounded space-y-2 font-mono text-xs overflow-x-auto">
                <pre className="whitespace-pre-wrap">{`INSERT INTO public.admin_users (id)
SELECT id FROM auth.users WHERE email = 'admin@example.com'
ON CONFLICT (id) DO NOTHING;`}</pre>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(`INSERT INTO public.admin_users (id)
SELECT id FROM auth.users WHERE email = 'admin@example.com'
ON CONFLICT (id) DO NOTHING;`)
                }
                className="flex items-center gap-2"
              >
                <Copy size={16} />
                Copy Command
              </Button>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  3
                </div>
                <CardTitle>Access Admin Dashboard</CardTitle>
              </div>
              <CardDescription>Log in to the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Go to <code className="bg-muted px-2 py-1 rounded">/admin/login</code> and sign in with your admin
                credentials.
              </p>
              <p className="text-sm text-muted-foreground">
                You should now have access to the admin dashboard where you can manage products, orders, and payments.
              </p>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="default" className="w-full">
                <Link href="/auth/sign-up">Create Admin Account</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/admin/login">Go to Admin Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Alternative Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alternative: Find Your User ID</CardTitle>
              <CardDescription>If you need to find an existing user's ID</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                In your <strong>Supabase SQL Editor</strong>, run this to find user IDs:
              </p>
              <div className="bg-muted p-4 rounded font-mono text-xs overflow-x-auto">
                <pre className="whitespace-pre-wrap">{`SELECT id, email FROM auth.users;`}</pre>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(`SELECT id, email FROM auth.users;`)}
                className="flex items-center gap-2"
              >
                <Copy size={16} />
                Copy Query
              </Button>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-semibold mb-1">Admin login not working?</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Verify email is confirmed in Supabase Auth</li>
                  <li>Check that admin_users record was created</li>
                  <li>Clear browser cache and try again</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-1">Can't find user ID?</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Run the SELECT query above in Supabase SQL Editor</li>
                  <li>Copy the UUID from the id column</li>
                  <li>Use it in the INSERT command</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Need help? Check the ECOMMERCE_SETUP.md file for detailed instructions.</p>
        </div>
      </div>
    </div>
  )
}
