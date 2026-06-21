package com.student.dto;

import lombok.*;
import java.util.List;

/**
 * DTO carrying all statistics shown on the dashboard.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {

    private long totalStudents;
    private long activeStudents;
    private long inactiveStudents;
    private long totalDepartments;
    private long totalCourses;
    private List<StudentResponse> recentAdmissions;
}
