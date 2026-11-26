-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('PRE_HIRE', 'ACTIVE', 'OFFBOARDING', 'LEFT');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('EMPLOYEE', 'MANAGER', 'HR', 'IT', 'SECURITY', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('LAPTOP', 'MONITOR', 'PHONE', 'OTHER');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('IN_STOCK', 'ASSIGNED', 'EXCEPTION_NOT_RETURNED', 'RETIRED');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'DISABLED', 'REVOKED');

-- CreateEnum
CREATE TYPE "GrantSource" AS ENUM ('ONBOARDING', 'ACCESS_REQUEST', 'MANUAL');

-- CreateEnum
CREATE TYPE "GrantStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'REVOKED');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('IN_PROGRESS', 'PENDING_CONDITIONS', 'PENDING_HR_CONFIRMATION', 'COMPLETED');

-- CreateEnum
CREATE TYPE "OnAccessStatus" AS ENUM ('WAITING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "OnAccessStep" AS ENUM ('MANAGER_REVIEW', 'SECURITY_REVIEW', 'IT_PROVISION');

-- CreateEnum
CREATE TYPE "OnDeviceStatus" AS ENUM ('PREPARING', 'WAITING_DEVICE', 'HANDED_OVER');

-- CreateEnum
CREATE TYPE "HandoverCondition" AS ENUM ('NEW', 'USED_GOOD', 'USED_NOTED');

-- CreateEnum
CREATE TYPE "AccessRequestStatus" AS ENUM ('PENDING_MANAGER', 'NEED_INFO', 'PENDING_SECURITY', 'PENDING_PROVISION', 'GRANTED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ApproverRole" AS ENUM ('MANAGER', 'SECURITY');

-- CreateEnum
CREATE TYPE "Decision" AS ENUM ('APPROVE', 'REJECT', 'REQUEST_INFO');

-- CreateEnum
CREATE TYPE "LeaveReason" AS ENUM ('VOLUNTARY', 'TERMINATION', 'OTHER');

-- CreateEnum
CREATE TYPE "HandoverStatus" AS ENUM ('NOT_HANDED_OVER', 'HANDED_OVER', 'NOT_MET');

-- CreateEnum
CREATE TYPE "RevocationSource" AS ENUM ('ELAMS', 'MANUAL');

-- CreateEnum
CREATE TYPE "RevocationStatus" AS ENUM ('WAITING', 'IN_PROGRESS', 'REVOKED', 'DISABLED', 'NOT_REVOKED');

-- CreateEnum
CREATE TYPE "DeviceReturnStatus" AS ENUM ('WAITING', 'RETURNED', 'MISSING_PENDING_DECISION', 'EXCEPTION_NOT_RETURNED');

-- CreateEnum
CREATE TYPE "ReturnCondition" AS ENUM ('GOOD', 'MINOR_DAMAGE', 'MAJOR_DAMAGE');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('ON_ACCESS_REVIEW', 'ON_ACCESS_ADJUST', 'SECURITY_REVIEW', 'PROVISION', 'ON_DEVICE', 'ON_CONFIRM', 'AR_REVIEW', 'AR_NEED_INFO', 'OFF_HANDOVER', 'OFF_HANDOVER_UPDATE', 'OFF_REVOKE', 'OFF_DEVICE', 'OFF_DEVICE_EXCEPTION', 'OFF_CONFIRM');

-- CreateEnum
CREATE TYPE "ObjectType" AS ENUM ('ONBOARDING_REQUEST', 'ONBOARDING_ACCESS_ITEM', 'ONBOARDING_DEVICE_ITEM', 'ACCESS_REQUEST', 'OFFBOARDING_REQUEST', 'HANDOVER_ITEM', 'REVOCATION_ITEM', 'DEVICE_RETURN_ITEM', 'EMPLOYEE', 'CATALOG', 'APP_USER', 'SYSTEM');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('OPEN', 'WAITING', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SendStatus" AS ENUM ('SENT', 'FAILED');

-- CreateTable
CREATE TABLE "department" (
    "department_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "job_title" (
    "job_title_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_title_pkey" PRIMARY KEY ("job_title_id")
);

-- CreateTable
CREATE TABLE "employee" (
    "employee_id" SERIAL NOT NULL,
    "employee_code" VARCHAR(20) NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "personal_email" VARCHAR(150) NOT NULL,
    "department_id" INTEGER NOT NULL,
    "job_title_id" INTEGER NOT NULL,
    "manager_id" INTEGER,
    "status" "EmployeeStatus" NOT NULL,
    "start_date" DATE NOT NULL,
    "last_working_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "app_user" (
    "user_id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "role" "Role" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "target_system" (
    "system_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "target_system_pkey" PRIMARY KEY ("system_id")
);

-- CreateTable
CREATE TABLE "access_catalog" (
    "access_id" SERIAL NOT NULL,
    "system_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "access_levels" VARCHAR(200) NOT NULL,
    "is_sensitive" BOOLEAN NOT NULL,
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "access_catalog_pkey" PRIMARY KEY ("access_id")
);

-- CreateTable
CREATE TABLE "position_access_template" (
    "template_id" SERIAL NOT NULL,
    "job_title_id" INTEGER NOT NULL,
    "access_id" INTEGER NOT NULL,
    "default_level" VARCHAR(50) NOT NULL,
    "is_mandatory" BOOLEAN NOT NULL,
    "sequence_no" INTEGER NOT NULL,

    CONSTRAINT "position_access_template_pkey" PRIMARY KEY ("template_id")
);

-- CreateTable
CREATE TABLE "position_device_template" (
    "template_id" SERIAL NOT NULL,
    "job_title_id" INTEGER NOT NULL,
    "device_type" "DeviceType" NOT NULL,
    "config_note" VARCHAR(200),

    CONSTRAINT "position_device_template_pkey" PRIMARY KEY ("template_id")
);

-- CreateTable
CREATE TABLE "device" (
    "device_id" SERIAL NOT NULL,
    "asset_code" VARCHAR(30) NOT NULL,
    "device_type" "DeviceType" NOT NULL,
    "description" VARCHAR(200),
    "status" "DeviceStatus" NOT NULL,
    "holder_employee_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_pkey" PRIMARY KEY ("device_id")
);

-- CreateTable
CREATE TABLE "system_account" (
    "account_id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "system_id" INTEGER NOT NULL,
    "account_identifier" VARCHAR(100) NOT NULL,
    "status" "AccountStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_account_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "access_grant" (
    "grant_id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "access_id" INTEGER,
    "account_id" INTEGER NOT NULL,
    "access_level" VARCHAR(50) NOT NULL,
    "source" "GrantSource" NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL,
    "status" "GrantStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "access_grant_pkey" PRIMARY KEY ("grant_id")
);

-- CreateTable
CREATE TABLE "onboarding_request" (
    "onboarding_id" SERIAL NOT NULL,
    "request_code" VARCHAR(20) NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "manager_id" INTEGER NOT NULL,
    "hr_user_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "original_start_date" DATE,
    "status" "CaseStatus" NOT NULL,
    "note" TEXT,
    "submission_key" VARCHAR(64),
    "completed_at" TIMESTAMP(3),
    "conditions_checked_rev" INTEGER NOT NULL DEFAULT 0,
    "data_rev" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_request_pkey" PRIMARY KEY ("onboarding_id")
);

-- CreateTable
CREATE TABLE "onboarding_access_item" (
    "item_id" SERIAL NOT NULL,
    "onboarding_id" INTEGER NOT NULL,
    "access_id" INTEGER NOT NULL,
    "access_level" VARCHAR(50) NOT NULL,
    "is_mandatory" BOOLEAN NOT NULL,
    "from_template" BOOLEAN NOT NULL DEFAULT false,
    "sequence_no" INTEGER NOT NULL,
    "status" "OnAccessStatus" NOT NULL,
    "current_step" "OnAccessStep",
    "blocked_reason" VARCHAR(500),
    "blocked_kind" VARCHAR(30),
    "account_id" INTEGER,
    "evidence_ref" VARCHAR(300),
    "approval_round" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_access_item_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "onboarding_device_item" (
    "item_id" SERIAL NOT NULL,
    "onboarding_id" INTEGER NOT NULL,
    "device_type" "DeviceType" NOT NULL,
    "config_note" VARCHAR(200),
    "from_template" BOOLEAN NOT NULL DEFAULT false,
    "device_id" INTEGER,
    "status" "OnDeviceStatus" NOT NULL,
    "waiting_reason" VARCHAR(300),
    "expected_at" DATE,
    "waiting_since" TIMESTAMP(3),
    "handed_over_at" TIMESTAMP(3),
    "device_condition" "HandoverCondition",
    "condition_note" VARCHAR(300),
    "handover_record_code" VARCHAR(30),
    "handover_record_file" VARCHAR(300),
    "handed_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_device_item_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "access_request" (
    "request_id" SERIAL NOT NULL,
    "request_code" VARCHAR(20) NOT NULL,
    "requester_id" INTEGER NOT NULL,
    "access_id" INTEGER NOT NULL,
    "access_level" VARCHAR(50) NOT NULL,
    "reason" TEXT NOT NULL,
    "needed_by" DATE,
    "attachment" VARCHAR(300),
    "approver_id" INTEGER NOT NULL,
    "status" "AccessRequestStatus" NOT NULL,
    "account_id" INTEGER,
    "evidence_ref" VARCHAR(300),
    "provision_failure" VARCHAR(500),
    "submission_key" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "access_request_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "approval_decision" (
    "decision_id" SERIAL NOT NULL,
    "onboarding_item_id" INTEGER,
    "access_request_id" INTEGER,
    "decided_by" INTEGER NOT NULL,
    "approver_role" "ApproverRole" NOT NULL,
    "decision" "Decision" NOT NULL,
    "access_level" VARCHAR(50),
    "round" INTEGER NOT NULL DEFAULT 1,
    "reason" TEXT,
    "decided_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "approval_decision_pkey" PRIMARY KEY ("decision_id")
);

-- CreateTable
CREATE TABLE "offboarding_request" (
    "offboarding_id" SERIAL NOT NULL,
    "request_code" VARCHAR(20) NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "hr_user_id" INTEGER NOT NULL,
    "last_working_date" DATE NOT NULL,
    "original_last_working_date" DATE,
    "leave_reason" "LeaveReason" NOT NULL,
    "is_urgent" BOOLEAN NOT NULL,
    "urgent_reason" VARCHAR(500),
    "revoke_at" TIMESTAMP(3) NOT NULL,
    "revoke_due_at" TIMESTAMP(3),
    "handover_confirmed_at" TIMESTAMP(3),
    "status" "CaseStatus" NOT NULL,
    "note" TEXT,
    "submission_key" VARCHAR(64),
    "completed_at" TIMESTAMP(3),
    "conditions_checked_rev" INTEGER NOT NULL DEFAULT 0,
    "data_rev" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offboarding_request_pkey" PRIMARY KEY ("offboarding_id")
);

-- CreateTable
CREATE TABLE "handover_item" (
    "item_id" SERIAL NOT NULL,
    "offboarding_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "due_date" DATE NOT NULL,
    "status" "HandoverStatus" NOT NULL,
    "not_met_reason" VARCHAR(500),
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "handover_item_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "revocation_item" (
    "item_id" SERIAL NOT NULL,
    "offboarding_id" INTEGER NOT NULL,
    "grant_id" INTEGER,
    "system_id" INTEGER NOT NULL,
    "account_id" INTEGER,
    "access_name" VARCHAR(100) NOT NULL,
    "access_level" VARCHAR(50),
    "source" "RevocationSource" NOT NULL,
    "status" "RevocationStatus" NOT NULL,
    "evidence_ref" VARCHAR(300),
    "failure_reason" VARCHAR(500),
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revocation_item_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "device_return_item" (
    "item_id" SERIAL NOT NULL,
    "offboarding_id" INTEGER NOT NULL,
    "device_id" INTEGER NOT NULL,
    "status" "DeviceReturnStatus" NOT NULL,
    "returned_at" TIMESTAMP(3),
    "device_condition" "ReturnCondition",
    "missing_reason" VARCHAR(500),
    "evidence_ref" VARCHAR(300),
    "exception_by" INTEGER,
    "exception_reason" VARCHAR(500),
    "exception_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_return_item_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "task" (
    "task_id" SERIAL NOT NULL,
    "task_type" "TaskType" NOT NULL,
    "object_type" "ObjectType" NOT NULL,
    "object_id" INTEGER NOT NULL,
    "case_code" VARCHAR(20),
    "title" VARCHAR(200) NOT NULL,
    "assignee_id" INTEGER NOT NULL,
    "due_at" TIMESTAMP(3),
    "status" "TaskStatus" NOT NULL,
    "is_urgent" BOOLEAN NOT NULL DEFAULT false,
    "overdue_alerted_for" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("task_id")
);

-- CreateTable
CREATE TABLE "notification" (
    "notification_id" SERIAL NOT NULL,
    "recipient_id" INTEGER NOT NULL,
    "task_id" INTEGER,
    "message" VARCHAR(500) NOT NULL,
    "link" VARCHAR(200),
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "send_status" "SendStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "log_id" SERIAL NOT NULL,
    "actor_id" INTEGER,
    "action" VARCHAR(50) NOT NULL,
    "object_type" "ObjectType" NOT NULL,
    "object_id" INTEGER NOT NULL,
    "case_code" VARCHAR(20),
    "result" VARCHAR(50) NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "system_setting" (
    "key" VARCHAR(50) NOT NULL,
    "value" VARCHAR(200) NOT NULL,

    CONSTRAINT "system_setting_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "department_name_key" ON "department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "job_title_name_key" ON "job_title"("name");

-- CreateIndex
CREATE UNIQUE INDEX "employee_employee_code_key" ON "employee"("employee_code");

-- CreateIndex
CREATE UNIQUE INDEX "app_user_employee_id_key" ON "app_user"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "app_user_username_key" ON "app_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "target_system_name_key" ON "target_system"("name");

-- CreateIndex
CREATE UNIQUE INDEX "access_catalog_system_id_name_key" ON "access_catalog"("system_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "position_access_template_job_title_id_access_id_key" ON "position_access_template"("job_title_id", "access_id");

-- CreateIndex
CREATE UNIQUE INDEX "device_asset_code_key" ON "device"("asset_code");

-- CreateIndex
CREATE UNIQUE INDEX "system_account_employee_id_system_id_key" ON "system_account"("employee_id", "system_id");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_request_request_code_key" ON "onboarding_request"("request_code");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_request_submission_key_key" ON "onboarding_request"("submission_key");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_access_item_onboarding_id_access_id_key" ON "onboarding_access_item"("onboarding_id", "access_id");

-- CreateIndex
CREATE UNIQUE INDEX "access_request_request_code_key" ON "access_request"("request_code");

-- CreateIndex
CREATE UNIQUE INDEX "access_request_submission_key_key" ON "access_request"("submission_key");

-- CreateIndex
CREATE UNIQUE INDEX "offboarding_request_request_code_key" ON "offboarding_request"("request_code");

-- CreateIndex
CREATE UNIQUE INDEX "offboarding_request_submission_key_key" ON "offboarding_request"("submission_key");

-- CreateIndex
CREATE UNIQUE INDEX "revocation_item_grant_id_key" ON "revocation_item"("grant_id");

-- CreateIndex
CREATE INDEX "task_assignee_id_status_idx" ON "task"("assignee_id", "status");

-- CreateIndex
CREATE INDEX "task_object_type_object_id_idx" ON "task"("object_type", "object_id");

-- CreateIndex
CREATE INDEX "notification_recipient_id_is_read_idx" ON "notification"("recipient_id", "is_read");

-- CreateIndex
CREATE INDEX "audit_log_case_code_idx" ON "audit_log"("case_code");

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_job_title_id_fkey" FOREIGN KEY ("job_title_id") REFERENCES "job_title"("job_title_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "employee"("employee_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user" ADD CONSTRAINT "app_user_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_catalog" ADD CONSTRAINT "access_catalog_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "target_system"("system_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "position_access_template" ADD CONSTRAINT "position_access_template_job_title_id_fkey" FOREIGN KEY ("job_title_id") REFERENCES "job_title"("job_title_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "position_access_template" ADD CONSTRAINT "position_access_template_access_id_fkey" FOREIGN KEY ("access_id") REFERENCES "access_catalog"("access_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "position_device_template" ADD CONSTRAINT "position_device_template_job_title_id_fkey" FOREIGN KEY ("job_title_id") REFERENCES "job_title"("job_title_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device" ADD CONSTRAINT "device_holder_employee_id_fkey" FOREIGN KEY ("holder_employee_id") REFERENCES "employee"("employee_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_account" ADD CONSTRAINT "system_account_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_account" ADD CONSTRAINT "system_account_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "target_system"("system_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_grant" ADD CONSTRAINT "access_grant_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_grant" ADD CONSTRAINT "access_grant_access_id_fkey" FOREIGN KEY ("access_id") REFERENCES "access_catalog"("access_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_grant" ADD CONSTRAINT "access_grant_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "system_account"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_request" ADD CONSTRAINT "onboarding_request_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_request" ADD CONSTRAINT "onboarding_request_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_request" ADD CONSTRAINT "onboarding_request_hr_user_id_fkey" FOREIGN KEY ("hr_user_id") REFERENCES "app_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_access_item" ADD CONSTRAINT "onboarding_access_item_onboarding_id_fkey" FOREIGN KEY ("onboarding_id") REFERENCES "onboarding_request"("onboarding_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_access_item" ADD CONSTRAINT "onboarding_access_item_access_id_fkey" FOREIGN KEY ("access_id") REFERENCES "access_catalog"("access_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_access_item" ADD CONSTRAINT "onboarding_access_item_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "system_account"("account_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_device_item" ADD CONSTRAINT "onboarding_device_item_onboarding_id_fkey" FOREIGN KEY ("onboarding_id") REFERENCES "onboarding_request"("onboarding_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_device_item" ADD CONSTRAINT "onboarding_device_item_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device"("device_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_device_item" ADD CONSTRAINT "onboarding_device_item_handed_by_fkey" FOREIGN KEY ("handed_by") REFERENCES "app_user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_request" ADD CONSTRAINT "access_request_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_request" ADD CONSTRAINT "access_request_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_request" ADD CONSTRAINT "access_request_access_id_fkey" FOREIGN KEY ("access_id") REFERENCES "access_catalog"("access_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_request" ADD CONSTRAINT "access_request_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "system_account"("account_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_decision" ADD CONSTRAINT "approval_decision_onboarding_item_id_fkey" FOREIGN KEY ("onboarding_item_id") REFERENCES "onboarding_access_item"("item_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_decision" ADD CONSTRAINT "approval_decision_access_request_id_fkey" FOREIGN KEY ("access_request_id") REFERENCES "access_request"("request_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_decision" ADD CONSTRAINT "approval_decision_decided_by_fkey" FOREIGN KEY ("decided_by") REFERENCES "app_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offboarding_request" ADD CONSTRAINT "offboarding_request_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offboarding_request" ADD CONSTRAINT "offboarding_request_hr_user_id_fkey" FOREIGN KEY ("hr_user_id") REFERENCES "app_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "handover_item" ADD CONSTRAINT "handover_item_offboarding_id_fkey" FOREIGN KEY ("offboarding_id") REFERENCES "offboarding_request"("offboarding_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "handover_item" ADD CONSTRAINT "handover_item_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "handover_item" ADD CONSTRAINT "handover_item_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "app_user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revocation_item" ADD CONSTRAINT "revocation_item_offboarding_id_fkey" FOREIGN KEY ("offboarding_id") REFERENCES "offboarding_request"("offboarding_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revocation_item" ADD CONSTRAINT "revocation_item_grant_id_fkey" FOREIGN KEY ("grant_id") REFERENCES "access_grant"("grant_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revocation_item" ADD CONSTRAINT "revocation_item_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "target_system"("system_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revocation_item" ADD CONSTRAINT "revocation_item_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "system_account"("account_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_return_item" ADD CONSTRAINT "device_return_item_offboarding_id_fkey" FOREIGN KEY ("offboarding_id") REFERENCES "offboarding_request"("offboarding_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_return_item" ADD CONSTRAINT "device_return_item_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_return_item" ADD CONSTRAINT "device_return_item_exception_by_fkey" FOREIGN KEY ("exception_by") REFERENCES "app_user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "app_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "app_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("task_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "app_user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ===== Ràng buộc nghiệp vụ (SRS mục 6) =====

-- BR-ON-01: REJECTED chỉ khi quyền không bắt buộc
ALTER TABLE "onboarding_access_item"
  ADD CONSTRAINT "chk_rejected_not_mandatory" CHECK (NOT (status = 'REJECTED' AND is_mandatory));

-- BR-ON-02: BLOCKED phải có lý do; COMPLETED phải có tài khoản và bằng chứng
ALTER TABLE "onboarding_access_item"
  ADD CONSTRAINT "chk_blocked_reason" CHECK (status <> 'BLOCKED' OR blocked_reason IS NOT NULL),
  ADD CONSTRAINT "chk_completed_evidence" CHECK (status <> 'COMPLETED' OR (account_id IS NOT NULL AND evidence_ref IS NOT NULL));

-- approval_decision thuộc đúng một trong onboarding item hoặc access request
ALTER TABLE "approval_decision"
  ADD CONSTRAINT "chk_decision_single_owner" CHECK ((onboarding_item_id IS NULL) <> (access_request_id IS NULL)),
-- BR-GEN-02: lý do bắt buộc khi từ chối, yêu cầu bổ sung
  ADD CONSTRAINT "chk_decision_reason" CHECK (decision = 'APPROVE' OR (reason IS NOT NULL AND length(trim(reason)) > 0)),
-- Q-36: REQUEST_INFO chỉ cho Manager trên access_request
  ADD CONSTRAINT "chk_request_info_scope" CHECK (decision <> 'REQUEST_INFO' OR (approver_role = 'MANAGER' AND access_request_id IS NOT NULL));

-- BR-AC-07: không có hai yêu cầu chưa kết thúc cùng (requester, access)
CREATE UNIQUE INDEX "uq_access_request_open"
  ON "access_request" (requester_id, access_id)
  WHERE status NOT IN ('GRANTED', 'REJECTED', 'CANCELLED');

-- BR-AC-05: GRANTED phải có tài khoản và bằng chứng
ALTER TABLE "access_request"
  ADD CONSTRAINT "chk_granted_evidence" CHECK (status <> 'GRANTED' OR (account_id IS NOT NULL AND evidence_ref IS NOT NULL)),
  ADD CONSTRAINT "chk_not_self_approve" CHECK (requester_id <> approver_id);

-- BR-ON-11: tối đa một onboarding / offboarding chưa hoàn tất cho mỗi nhân viên
CREATE UNIQUE INDEX "uq_onboarding_open" ON "onboarding_request" (employee_id) WHERE status <> 'COMPLETED';
CREATE UNIQUE INDEX "uq_offboarding_open" ON "offboarding_request" (employee_id) WHERE status <> 'COMPLETED';

-- BR-OFF-05: không có trạng thái ngoại lệ; bằng chứng/lý do theo kết quả
ALTER TABLE "revocation_item"
  ADD CONSTRAINT "chk_revocation_evidence" CHECK (status NOT IN ('REVOKED', 'DISABLED') OR evidence_ref IS NOT NULL),
  ADD CONSTRAINT "chk_revocation_failure" CHECK (status <> 'NOT_REVOKED' OR failure_reason IS NOT NULL);

-- BR-OFF-06: ngoại lệ thiết bị phải có người duyệt và lý do
ALTER TABLE "device_return_item"
  ADD CONSTRAINT "chk_device_exception" CHECK (status <> 'EXCEPTION_NOT_RETURNED' OR (exception_by IS NOT NULL AND exception_reason IS NOT NULL)),
  ADD CONSTRAINT "chk_device_returned" CHECK (status <> 'RETURNED' OR (returned_at IS NOT NULL AND device_condition IS NOT NULL));

-- BR-ON-03 / FR-ON-14
ALTER TABLE "onboarding_device_item"
  ADD CONSTRAINT "chk_waiting_reason" CHECK (status <> 'WAITING_DEVICE' OR waiting_reason IS NOT NULL),
  ADD CONSTRAINT "chk_handover_complete" CHECK (status <> 'HANDED_OVER' OR (device_id IS NOT NULL AND handed_over_at IS NOT NULL AND device_condition IS NOT NULL AND handover_record_code IS NOT NULL AND handover_record_file IS NOT NULL));

ALTER TABLE "handover_item"
  ADD CONSTRAINT "chk_not_met_reason" CHECK (status <> 'NOT_MET' OR not_met_reason IS NOT NULL);

-- BR-GEN-03: audit_log chỉ thêm mới
CREATE FUNCTION audit_log_append_only() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_log_append_only
  BEFORE UPDATE OR DELETE ON "audit_log"
  FOR EACH ROW EXECUTE FUNCTION audit_log_append_only();
