-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('INTERN', 'ENGINEER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'CUSTOMER', 'MERCHANT');

-- CreateEnum
CREATE TYPE "public"."ParcelType" AS ENUM ('REGULAR', 'EXPRESS');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PROGRESS', 'OUT', 'CANCEL');

-- CreateEnum
CREATE TYPE "public"."IssueType" AS ENUM ('PICKUP', 'DELIVERY', 'PAYMENT', 'BILLINGANDCHARGES', 'SERVICES', 'OHTERS');

-- CreateEnum
CREATE TYPE "public"."TokenStatus" AS ENUM ('OPEN', 'RESOLVE', 'PENDING');

-- CreateTable
CREATE TABLE "public"."Employee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "businessName" TEXT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'MERCHANT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "postalCode" TEXT,
    "shippingAddress" TEXT NOT NULL,
    "billingAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Parcel" (
    "id" SERIAL NOT NULL,
    "parcelName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "invoice" TEXT,
    "notes" TEXT NOT NULL,
    "height" INTEGER NOT NULL DEFAULT 0,
    "weight" INTEGER NOT NULL DEFAULT 0,
    "length" INTEGER NOT NULL DEFAULT 0,
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "Parcel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "Status" "public"."OrderStatus" NOT NULL,
    "parcelId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Token" (
    "id" SERIAL NOT NULL,
    "typeOfIssue" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Status" "public"."TokenStatus" NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "public"."Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "public"."Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "public"."Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Order_parcelId_key" ON "public"."Order"("parcelId");

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Parcel" ADD CONSTRAINT "Parcel_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "public"."Parcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
