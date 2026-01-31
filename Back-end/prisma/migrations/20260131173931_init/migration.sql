-- CreateTable
CREATE TABLE "Basemodel" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Basemodel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "companyName" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255),
    "siret" VARCHAR(14),
    "establishment_type" VARCHAR(100),
    "description" TEXT,
    "website" VARCHAR(255),
    "social_media" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "city" VARCHAR(100),
    "postalCode" VARCHAR(20),
    "photoURL" VARCHAR(255),
    "profession" VARCHAR(100),
    "experience_years" INTEGER,
    "languages" TEXT,
    "qualifications" TEXT,
    "cv_url" VARCHAR(255),
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "phoneNumber" VARCHAR(20),
    "skills" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "salary" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "companyId" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobOffer" (
    "id" SERIAL NOT NULL,
    "request_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "response_at" TIMESTAMP(3),
    "selected_at" TIMESTAMP(3),
    "contract_url" VARCHAR(255),
    "contract_signed" BOOLEAN DEFAULT false,
    "signed_at" TIMESTAMP(3),
    "selected_by_company" BOOLEAN DEFAULT false,
    "jobId" INTEGER NOT NULL,
    "workerId" INTEGER NOT NULL,
    "applicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "jobId" INTEGER NOT NULL,
    "reviewerId" INTEGER NOT NULL,
    "revieweeId" INTEGER NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "jobOfferId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "idx_companyId" ON "Job"("companyId");

-- CreateIndex
CREATE INDEX "idx_jobId" ON "JobOffer"("jobId");

-- CreateIndex
CREATE INDEX "idx_workerId" ON "JobOffer"("workerId");

-- CreateIndex
CREATE INDEX "idx_review_jobId" ON "Review"("jobId");
