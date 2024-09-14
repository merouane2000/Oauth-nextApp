"use client";
import { Card ,CardContent,CardFooter,CardHeader } from "../ui/card";
import { BackButton } from "./back-button";
import { Header } from "./header";
import { Social } from "./social";

export const ErrorCard =()=>{
    return(
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header label="Oops! Somthing went wrong "/>

            </CardHeader>
            <CardFooter>

            <BackButton label="Back to login" href="/auth/login"/>
            </CardFooter>

        </Card>
    )

}