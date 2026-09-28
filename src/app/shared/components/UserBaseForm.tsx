

// src/shared/components/UserBaseForm.tsx
import React, { useEffect } from "react";
import { BaseUserForm, UserBaseFormProps } from "../types/addUserForm";
import { useUserDetailsStore } from "../store/pgUserDetailsStore";
import { generatePassword } from "../utils/passwordGenerator";

const inputClass =
  "w-full border border-blue-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none";
const labelClass = "block mb-1 text-sm font-semibold text-gray-700";
const errorClass = "border-red-400 focus:ring-red-400";

// Only expose Manager and Staff from the full roles list returned by the API.
// API returns: Admin(1), Owner(2), Manager(3), Guest(4), Staff(5)
const ALLOWED_ROLES = ["Manager", "Staff"];

function UserBaseForm<T extends BaseUserForm>({
  form,
  update,
  states,
  cities,
  genders,
  pgList,
  hideLogin = false,
}: UserBaseFormProps<T>) {
  // ── Zustand store ──────────────────────────────────────────────────────────
  const { roles, fetchRoles } = useUserDetailsStore();
  console.log("roles from store:", roles);

  // Fetch roles on mount if not already loaded
  useEffect(() => {
    if (roles.length === 0) {
      fetchRoles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter API roles to only Manager and Staff
  const filteredRoles = roles.filter((r) => ALLOWED_ROLES.includes(r.role));

  // ── Helpers ────────────────────────────────────────────────────────────────
  const isEmpty = (value: any) =>
    value === undefined || value === null || value === "";

  // const filteredCities = cities.filter(
  //   (c: any) => Number(form.state_id) === c.state_id
  // );

  const filteredCities = cities.filter(
  (c: any) => Number(form.state_id) === c.pg_state_id
);

  // ── Auto-generate password on mount ───────────────────────────────────────
  useEffect(() => {
    if (!hideLogin && isEmpty(form.password)) {
      update("password", generatePassword() as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideLogin]);

  const handleRegeneratePassword = () => {
    update("password", generatePassword() as any);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* ── PERSONAL ─────────────────────────────────────────────────────── */}
      <section>
        <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>First Name *</label>
            <input
              className={`${inputClass} ${isEmpty(form.firstName) ? errorClass : ""}`}
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value as any)}
            />
          </div>

          <div>
            <label className={labelClass}>Last Name *</label>
            <input
              className={`${inputClass} ${isEmpty(form.lastName) ? errorClass : ""}`}
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value as any)}
            />
          </div>

          <div>
            <label className={labelClass}>Gender *</label>
            <select
              className={`${inputClass} ${isEmpty(form.gender) ? errorClass : ""}`}
              value={form.gender}
              onChange={(e) => update("gender", e.target.value as any)}
            >
              <option value="">Select</option>
              {genders.map((g: any) => (
                <option key={g.id} value={g.id}>
                  {g.gender_type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section>
        <h3 className="font-semibold text-gray-900 mb-4">Contact *</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            className={`${inputClass} ${isEmpty(form.mobile) ? errorClass : ""}`}
            placeholder="Mobile"
            value={form.mobile}
            onChange={(e) => update("mobile", e.target.value as any)}
          />
          <input
            className={`${inputClass} ${isEmpty(form.email) ? errorClass : ""}`}
            placeholder="Email"
            value={form.email}
            onChange={(e) => update("email", e.target.value as any)}
          />
        </div>
      </section>

      {/* ── ADDRESS ──────────────────────────────────────────────────────── */}
      <section>
        <h3 className="font-semibold text-gray-900 mb-4">Address *</h3>

        <textarea
          className={`${inputClass} ${isEmpty(form.permanentAddress) ? errorClass : ""}`}
          rows={3}
          placeholder="Permanent Address"
          value={form.permanentAddress}
          onChange={(e) => update("permanentAddress", e.target.value as any)}
        />

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <select
            className={`${inputClass} ${isEmpty(form.state_id) ? errorClass : ""}`}
            value={form.state_id}
            onChange={(e) => update("state_id", e.target.value as any)}
          >
            <option value="">State</option>
            {states.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className={`${inputClass} ${isEmpty(form.city_id) ? errorClass : ""}`}
            value={form.city_id}
            onChange={(e) => update("city_id", e.target.value as any)}
          >
            <option value="">City</option>
            {filteredCities.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.city}
              </option>
            ))}
          </select>

          <input
            className={`${inputClass} ${isEmpty(form.pincode) ? errorClass : ""}`}
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) => update("pincode", e.target.value as any)}
          />
        </div>
      </section>

      {/* ── ROLE, PASSWORD & PG ──────────────────────────────────────────── */}
      {!hideLogin && (
        <section>
          <h3 className="font-semibold text-gray-900 mb-4">Role, Password & PG</h3>

          <div className="grid md:grid-cols-2 gap-4">

            {/* Role — sourced from Zustand store, filtered to Manager & Staff */}
            <div>
              <label className={labelClass}>Role *</label>
              <select
                className={`${inputClass} ${isEmpty((form as any).role_id) ? errorClass : ""}`}
                value={(form as any).role_id ?? ""}
                onChange={(e) => update("role_id" as any, e.target.value as any)}
                required
              >
                <option value="">Select Role</option>
                {filteredRoles.map((r) => (
                  // r.id is sent as the value (FK for backend), r.role is the label
                  <option key={r.id} value={r.id}>
                    {r.role}
                  </option>
                ))}
              </select>
            </div>

            {/* PG selector */}
            <div>
              <label className={labelClass}>PG *</label>
              <select
                className={`${inputClass} ${isEmpty((form as any).pg_info_id) ? errorClass : ""}`}
                value={(form as any).pg_info_id ?? ""}
                onChange={(e) => update("pg_info_id" as any, e.target.value as any)}
                required
              >
                <option value="">Select PG</option>
                {(pgList ?? []).map((pg: any) => (
                  <option key={pg.id} value={pg.id}>
                    {pg.pg_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Auto-generated password — read-only, regeneratable */}
          <div className="mt-4">
            <label className={labelClass}>
              Auto-Generated Password
              <span className="ml-2 text-xs font-normal text-gray-400">
                (bcrypt-hashed on the server before storage)
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                className={`${inputClass} bg-gray-50 font-mono tracking-widest cursor-default select-all`}
                value={form.password}
                title="Click to select all, then copy"
              />
              <button
                type="button"
                onClick={handleRegeneratePassword}
                title="Generate a new password"
                className="flex-shrink-0 px-3 py-2 rounded-lg border border-blue-300 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors"
              >
                ↻ New
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Copy and share this password securely with the user before saving.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

export default UserBaseForm;