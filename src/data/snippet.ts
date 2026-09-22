// Heading correction from the SoutheastCon 2026 ground robot's drive loop.
// Trimmed from robot_drive() in ground-team/motor-controls/robot.c.
export const codeSnippet = {
  file: "robot.c",
  project: "SoutheastCon 2026 Ground Robot",
  href: "https://github.com/Florida-Poly-IEEE-RAS-Society/SECON26/blob/main/ground-team/motor-controls/robot.c",
  code: `while (1) {
  float dl = enc_get_dist_in(&bot->enc1);
  float dr = enc_get_dist_in(&bot->enc2);
  if ((dl + dr) * 0.5f >= target)
    break;

  float now = _now_s();
  float dt = now - prev_t;
  prev_t = now;

  float gz;
  if (imu_read_gyro_z(&bot->imu, &gz) == OK)
    heading += gz * dt;

  if (heading > to_rad(DRIVE_CORRECTION_DEG)) {
    motor_set(&bot->m1, MOTOR_STOP);
    motor_set(&bot->m2, dir);
  } else if (heading < -to_rad(DRIVE_CORRECTION_DEG)) {
    motor_set(&bot->m1, dir);
    motor_set(&bot->m2, MOTOR_STOP);
  } else {
    motor_set(&bot->m1, dir);
    motor_set(&bot->m2, dir);
  }

  usleep(DRIVE_LOOP_US);
}`,
};
