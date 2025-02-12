"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useCopyToClipboard } from "@/hooks/use-copy";
import { Toaster } from "sonner";

export default function HomePage() {
  const [databaseType, setDatabaseType] = useState<"mysql" | "postgres">(
    "mysql",
  );
  const [restartPolicy, setRestartPolicy] = useState("unless-stopped");
  const [rootPassword, setRootPassword] = useState("");
  const [dbName, setDbName] = useState("");
  const [generatedYaml, setGeneratedYaml] = useState("");
  const form = useForm();
  const { copyToClipboard } = useCopyToClipboard();

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(
      { length: 16 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  };

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow-md sm:p-8">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Docker Compose Generator
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                const yamlContent = `services:\n  db:\n    image: ${databaseType === "mysql" ? "mysql:9.2.0" : "postgres:latest"}\n    restart: ${restartPolicy}\n    environment:\n      ${databaseType === "mysql" ? "MYSQL_ROOT_PASSWORD" : "POSTGRES_PASSWORD"}: ${rootPassword}\n      ${databaseType === "mysql" ? "MYSQL_DATABASE" : "POSTGRES_DB"}: ${dbName}\n    ports:\n      - ${databaseType === "mysql" ? "3306:3306" : "5432:5432"}`;
                setGeneratedYaml(yamlContent);
              })}
            >
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Database Type</Label>
                    <Select
                      value={databaseType}
                      onValueChange={(v) =>
                        setDatabaseType(v as "mysql" | "postgres")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select database" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mysql">MySQL</SelectItem>
                        <SelectItem value="postgres">Postgres</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Restart Policy</Label>
                    <Select
                      value={restartPolicy}
                      onValueChange={setRestartPolicy}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select policy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unless-stopped">
                          Unless Stopped
                        </SelectItem>
                        <SelectItem value="always">Always</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  {databaseType === "mysql" && (
                    <div className="space-y-2">
                      <Label>MySQL Root Password</Label>
                      <div className="flex gap-2">
                        <Input
                          value={rootPassword}
                          onChange={(e) => setRootPassword(e.target.value)}
                          placeholder="Enter root password"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setRootPassword(generatePassword())}
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                  )}

                  {databaseType === "postgres" && (
                    <div className="space-y-2">
                      <Label>Postgres Password</Label>
                      <Input
                        value={rootPassword}
                        onChange={(e) => setRootPassword(e.target.value)}
                        placeholder="Enter postgres password"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Database Name</Label>
                    <Input
                      value={dbName}
                      onChange={(e) => setDbName(e.target.value)}
                      placeholder="Enter database name"
                    />
                  </div>
                </div>
                <Button type="submit">Generate Docker Compose</Button>
              </div>
            </form>
          </Form>
          {generatedYaml && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">docker-compose.yml</h3>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(generatedYaml)}
                >
                  Copy
                </Button>
              </div>
              <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-sm">
                <code>{generatedYaml}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </main>
  );
}
