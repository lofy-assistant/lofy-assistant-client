import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import AppNavbar from "@/components/app-navbar";

export default function AboutUsPage() {
  return (
    <div>
      <AppNavbar />
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold">About Us</h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
            We are passionate about creating innovative solutions that make a
            difference in million of lives.
          </p>
        </div>

        <div className="grid gap-8 mb-16 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To deliver cutting-edge technology solutions that empower
                businesses and individuals to achieve their goals efficiently
                and effectively.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To be the leading provider of innovative digital solutions that
                transform the way people work and live.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-center">Our Team</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="John Doe" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <CardTitle>John Doe</CardTitle>
                <CardDescription>CEO & Founder</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center text-muted-foreground">
                  Visionary leader with 10+ years of experience in tech
                  innovation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Jane Smith" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <CardTitle>Jane Smith</CardTitle>
                <CardDescription>CTO</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center text-muted-foreground">
                  Technical expert specializing in scalable architecture and AI
                  solutions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage
                    src="/placeholder-avatar.jpg"
                    alt="Mike Johnson"
                  />
                  <AvatarFallback>MJ</AvatarFallback>
                </Avatar>
                <CardTitle>Mike Johnson</CardTitle>
                <CardDescription>Head of Design</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center text-muted-foreground">
                  Creative designer focused on user experience and interface
                  design.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="emerald">Innovation</Badge>
              <Badge variant="indigo">Integrity</Badge>
              <Badge variant="emerald">Collaboration</Badge>
              <Badge variant="indigo">Excellence</Badge>
              <Badge variant="emerald">Customer Focus</Badge>
            </div>
            <p className="text-muted-foreground">
              These core values guide everything we do, from product development
              to customer service. We believe in building lasting relationships
              and delivering solutions that exceed expectations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
